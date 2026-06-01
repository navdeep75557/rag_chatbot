from typing import List, Dict, Optional
import chromadb
from chromadb.config import Settings
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.vectorstores import Chroma
import os


class ChromaDBHandler:
    """Handler for ChromaDB vector store operations"""

    def __init__(self, persist_directory: str = "./chroma_db", openai_api_key: str = ""):
        """Initialize ChromaDB"""
        self.persist_directory = persist_directory
        os.makedirs(persist_directory, exist_ok=True)

        if not openai_api_key:
            raise ValueError(
                "Missing OPENAI_API_KEY for OpenAI embeddings. "
                "Set the OPENAI_API_KEY environment variable or backend/.env file."
            )

        # Initialize embeddings
        self.embeddings = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=openai_api_key
        )

        # Initialize Chroma
        self.client = chromadb.HttpClient(
            host="localhost",
            port=8000
        )

    def add_documents(
        self,
        texts: List[str],
        metadatas: List[Dict],
        collection_name: str = "videos"
    ) -> bool:
        """Add documents to ChromaDB"""
        try:
            # Get or create collection
            collection = self.client.get_or_create_collection(
                name=collection_name,
                metadata={"hnsw:space": "cosine"}
            )

            # Generate IDs
            ids = [f"{metadata['video_id']}_chunk_{i}" for i, metadata in enumerate(metadatas)]

            # Add documents
            collection.add(
                ids=ids,
                documents=texts,
                metadatas=metadatas
            )

            return True
        except Exception as e:
            print(f"Error adding documents to ChromaDB: {str(e)}")
            return False

    def search(
        self,
        query: str,
        collection_name: str = "videos",
        n_results: int = 5
    ) -> List[Dict]:
        """Search for similar documents"""
        try:
            collection = self.client.get_collection(name=collection_name)

            # Embed the query
            query_embedding = self.embeddings.embed_query(query)

            # Search
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=n_results
            )

            # Format results
            documents = []
            if results and results['documents']:
                for i, doc in enumerate(results['documents'][0]):
                    documents.append({
                        'content': doc,
                        'metadata': results['metadatas'][0][i] if results['metadatas'] else {},
                        'distance': results['distances'][0][i] if results['distances'] else 0
                    })

            return documents
        except Exception as e:
            print(f"Error searching ChromaDB: {str(e)}")
            return []

    def delete_collection(self, collection_name: str) -> bool:
        """Delete a collection"""
        try:
            self.client.delete_collection(name=collection_name)
            return True
        except Exception as e:
            print(f"Error deleting collection: {str(e)}")
            return False

    def get_collection_info(self, collection_name: str) -> Optional[Dict]:
        """Get collection information"""
        try:
            collection = self.client.get_collection(name=collection_name)
            return {
                'name': collection.name,
                'count': collection.count()
            }
        except Exception as e:
            print(f"Error getting collection info: {str(e)}")
            return None
