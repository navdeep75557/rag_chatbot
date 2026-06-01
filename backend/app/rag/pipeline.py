from typing import AsyncGenerator, List, Dict, Optional
from langchain.chat_models import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain.vectorstores import Chroma
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.prompts import PromptTemplate
import json


class RAGPipeline:
    """LangChain RAG Pipeline for video comparison"""

    def __init__(self, openai_api_key: str, chroma_host: str = "localhost", chroma_port: int = 8000):
        if not openai_api_key:
            raise ValueError(
                "Missing OPENAI_API_KEY for RAG pipeline. "
                "Set the OPENAI_API_KEY environment variable or backend/.env file."
            )

        self.openai_api_key = openai_api_key
        self.chroma_host = chroma_host
        self.chroma_port = chroma_port

        # Initialize LLM
        self.llm = ChatOpenAI(
            model="gpt-4o-mini",
            temperature=0.7,
            openai_api_key=openai_api_key,
            streaming=True
        )

        # Initialize embeddings
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=openai_api_key
        )

        # Initialize vector store
        self.vectorstore = Chroma(
            client_type="http",
            host=chroma_host,
            port=chroma_port,
            embedding_function=self.embeddings,
            collection_name="videos"
        )

    def create_retriever(self, k: int = 5):
        """Create retriever from vector store"""
        return self.vectorstore.as_retriever(search_kwargs={"k": k})

    def create_comparison_prompt(self) -> PromptTemplate:
        """Create prompt template for video comparison"""
        template = """You are an expert video analyst specializing in social media content comparison.
        
You have access to transcripts and metadata from two videos:
- Video A: Provided in context
- Video B: Provided in context

Use the provided context to answer questions about these videos. When comparing, analyze:
1. Content similarities and differences
2. Engagement metrics and patterns
3. Audience appeal and messaging
4. Storytelling and structure
5. Calls-to-action and conversion potential

Always cite the specific video and chunk when referencing information.

Context from videos:
{context}

Question: {question}

Provide a detailed, insightful response that draws from both videos when relevant."""

        return PromptTemplate(
            input_variables=["context", "question"],
            template=template
        )

    async def query_streaming(
        self,
        question: str,
        chat_history: List[tuple],
        session_id: str
    ) -> AsyncGenerator[str, None]:
        """
        Stream responses token by token
        """
        retriever = self.create_retriever()

        # Create memory
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            input_key="question",
            output_key="answer"
        )

        # Add chat history to memory
        for human_msg, ai_msg in chat_history:
            memory.save_context({"question": human_msg}, {"answer": ai_msg})

        # Create chain
        prompt = self.create_comparison_prompt()

        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=self.llm,
            retriever=retriever,
            memory=memory,
            combine_docs_chain_kwargs={"prompt": prompt},
            return_source_documents=True
        )

        # Get response with streaming
        response = ""
        source_documents = []

        try:
            # Use invoke instead of acall for compatibility
            result = qa_chain({"question": question})

            response = result.get("answer", "")
            source_documents = result.get("source_documents", [])

            # Yield response token by token
            for token in response.split():
                yield token + " "

        except Exception as e:
            yield f"Error processing your question: {str(e)}"

        # After completion, return source info
        yield f"\n\n<!-- SOURCES -->\n"
        for doc in source_documents:
            metadata = doc.metadata if hasattr(doc, 'metadata') else {}
            yield json.dumps({
                "video_id": metadata.get("video_id", "unknown"),
                "platform": metadata.get("platform", "unknown"),
                "chunk_index": metadata.get("chunk_index", 0)
            }) + "\n"

    def extract_sources(self, response_text: str) -> List[Dict]:
        """Extract source citations from response"""
        sources = []
        lines = response_text.split("\n")

        in_sources = False
        for line in lines:
            if "<!-- SOURCES -->" in line:
                in_sources = True
                continue

            if in_sources and line.strip():
                try:
                    source = json.loads(line)
                    sources.append(source)
                except json.JSONDecodeError:
                    continue

        return sources

    def create_memory(self, chat_history: List[tuple]) -> ConversationBufferMemory:
        """Create conversation memory from chat history"""
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )

        for human_msg, ai_msg in chat_history:
            memory.save_context({"question": human_msg}, {"answer": ai_msg})

        return memory
