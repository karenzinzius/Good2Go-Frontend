import { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

interface AddItemFormProps {
  onAdd: (newItem: any) => void;
}

const AddItemForm = ({ onAdd }: AddItemFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Furniture");
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) return;

    const postData = {
      title,
      description,
      location,
      category,
      images, 
    };
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/posts`, postData, { withCredentials: true });
      onAdd(response.data); // Update the UI with the real saved post
      // Reset form...
      setTitle(""); setDescription(""); setLocation(""); setCategory("Furniture"); setImages([]);
      Swal.fire({
      title: 'Success!',
      text: 'Your item is now Posted! ✨',
      icon: 'success',
      confirmButtonColor: '#ff85a2',
    });
  } catch (err: any) {
    console.error("Upload failed", err);
   Swal.fire({
    title: 'Oh no!',
    text: err.response?.data?.message ||'Something went wrong with the upload.',
    icon: 'error',
    confirmButtonColor: '#ff85a2', // Cutesy pink!
  });
  }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const imageArray: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageArray.push(reader.result as string);
        if (imageArray.length === files.length) setImages(imageArray);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 bg-base-200 shadow-md grid gap-3">
      <h2 className="text-xl font-bold">Add New Item</h2>

      <input type="text" placeholder="Title" className="input input-bordered w-full" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="text" placeholder="Description" className="input input-bordered w-full" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="text" placeholder="Location" className="input input-bordered w-full" value={location} onChange={(e) => setLocation(e.target.value)} required />

      <input type="file" accept="image/*" multiple className="file-input file-input-bordered w-full" onChange={handleFiles} />

      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mt-2">
          {images.map((img, idx) => (
            <img key={idx} src={img} className="w-20 h-20 object-cover rounded-md" alt="preview" />
          ))}
        </div>
      )}

      <select className="select select-bordered w-full" value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Furniture</option>
        <option>Electronics</option>
        <option>Household</option>
      </select>

      <button type="submit" className="btn btn-primary w-full">Add Item</button>
    </form>
  );
};

export default AddItemForm;