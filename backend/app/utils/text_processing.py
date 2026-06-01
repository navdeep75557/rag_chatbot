from langchain.text_splitter import RecursiveCharacterTextSplitter


def chunk_transcript(
    transcript: str,
    chunk_size: int = 500,
    chunk_overlap: int = 100
) -> list[str]:
    """
    Split transcript into chunks using RecursiveCharacterTextSplitter
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""]
    )
    chunks = splitter.split_text(transcript)
    return chunks


def extract_hashtags(text: str) -> list[str]:
    """
    Extract hashtags from text
    """
    import re
    hashtags = re.findall(r'#\w+', text)
    return list(set(hashtags))
