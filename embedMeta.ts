import { exiftool } from "exiftool-vendored";
import { readFile } from "fs/promises";
import { createHash } from "crypto"; // Importing the crypto module for hashing

/**
 * Embed custom metadata into an image.
 * @param imagePath - The path to the image file.
 * @param authHash - The authentication hash computed from the image and biometric data.
 */
async function embedMetadata(imagePath: string, authHash: string): Promise<void> {
  try {
    // Check if the file exists before attempting to write metadata
    await readFile(imagePath); // This will throw an error if the file does not exist

    // Write the authentication hash into a custom EXIF field (e.g., UserComment)
    await exiftool.write(imagePath, {
      UserComment: authHash,
    });
    console.log("Metadata embedded successfully");
  } catch (error) {
    console.error("Error embedding metadata:", error);
  } finally {
    await exiftool.end();
  }
}

// Example usage:
async function main() {
  const imagePath = "path/to/your/image.jpg";
  
  // Compute your hash using SHA-256
  const hash = createHash('sha256');
  hash.update("your_image_data_here"); // Replace with actual image data
  const authHash = hash.digest('hex'); // Get the hash in hexadecimal format

  await embedMetadata(imagePath, authHash);
}

main(); 