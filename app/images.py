from dotenv import load_dotenv
import os
from imagekitio import ImageKit

load_dotenv()

imagekit = ImageKit(
    private_key=os.getenv("imagekitio_private_key"),        
    public_key=os.getenv("imagekitio_public_key"),
    url_endpoint=os.getenv("imagekitio_url")
)

