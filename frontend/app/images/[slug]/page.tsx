'use client'
import '@mantine/core/styles.css';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';

type PageProps = {
  params: {
    slug: string;
  };
};

export default function Home() {
  const params = useParams();
  const router = useRouter();
  const { slug } = params;

  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/getimages/${slug}`)
      .then(res => {
        if(res.ok){
          return res.json()
        }
        router.replace("/404")
        throw new Error("Collection not found")
      })
      .then(data => setImages(data));
  }, []);

  return (
    <>
    <div>
      <h1>Uploaded Images from {slug}</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {images.map((image) => (
          <div key={image.filename}>
            <img
              src={image.image}
              alt={image.filename}
              style={{ width: '200px', borderRadius: '8px' }}
            />
            <p>{image.filename}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}