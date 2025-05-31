from tensorflow.keras.models import load_model
import numpy as np
from PIL import Image
import io

# Load model first to verify input shape
model = load_model("model.h5")
print("Model expects input shape:", model.input_shape)  # Should show (None, 200, 200, 3)

def preprocess_image(image_bytes):
    # Convert bytes to PIL Image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    
    # Resize to EXACTLY 200x200 pixels (critical change)
    image = image.resize((200, 200))  # Must match model's expected input shape
    
    # Convert to array and normalize (if model expects [0-1] range)
    image_array = np.array(image) / 255.0
    
    # Add batch dimension (shape becomes [1, 200, 200, 3])
    image_array = np.expand_dims(image_array, axis=0)
    
    # Verification
    print("Processed image shape:", image_array.shape)  # Must be (1, 200, 200, 3)
    return image_array

def predict(image_bytes):
    processed = preprocess_image(image_bytes)
    
    # Double-check shape compatibility
    if processed.shape[1:] != model.input_shape[1:]:
        raise ValueError(
            f"Shape mismatch! Model expects {model.input_shape[1:]}, "
            f"got {processed.shape[1:]}"
        )
    
    prediction = model.predict(processed)
    return prediction.tolist()