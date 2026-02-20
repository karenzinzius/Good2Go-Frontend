import { useState } from "react";

interface AddItemFormProps {
  onAdd: (newItem: any) => void;
}

const AddItemForm = ({ onAdd }: AddItemFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Furniture");
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location) return;

    onAdd({ id: Date.now(), title, description, location, category, images, });
    setTitle(""); setDescription(""); setLocation(""); setCategory("Furniture"); setImages([]);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-6 bg-base-200 shadow-md grid gap-3">
      <h2 className="text-xl font-bold">Add New Item</h2>
      <input type="text" placeholder="Title" className="input input-bordered w-full" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <input type="text" placeholder="Description" className="input input-bordered w-full" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="text" placeholder="Location" className="input input-bordered w-full" value={location} onChange={(e) => setLocation(e.target.value)} required />
      <input
  type="file"
  accept="image/*"
  multiple
  className="file-input file-input-bordered w-full"
  onChange={(e) => {
    const files = e.target.files;
    if (!files) return;

    const imageArray: string[] = [];

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageArray.push(reader.result as string);

        if (imageArray.length === files.length) {
          setImages(imageArray);
        }
      };
      reader.readAsDataURL(file);
    });
  }}
/>
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
