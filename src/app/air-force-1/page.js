  // air-force-1/page.js
"use client";

import { useEffect, useState } from "react";

export default function BlobImagesPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/getBlobImages?containerName=airforce1`);
        if (!response.ok) {
          throw new Error("Failed to fetch images");
        }
        const data = await response.json();
        setImages(data.images || []);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div>
      <h1>Assignments of AirForce1</h1>
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
          {images.map((url, index) => (
            <img key={index} src={url} alt={`Image ${index + 1}`} style={{ width: "100%", height: "auto" }} />
          ))}
        </div>
      )}
    </div>
  );
}
