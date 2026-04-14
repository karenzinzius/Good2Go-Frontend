import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface AddItemFormProps {
  onAdd: (newItem: any) => void;
  onClose: () => void;
}

const AddItemForm = ({ onAdd, onClose }: AddItemFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Furniture");
  const [images, setImages] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const CATEGORIES = ["Furniture", "Electronics", "Clothing", "Books", "Household", "Other"];

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    setFileList((prev) => [...prev, ...newFiles]);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
  setImages((prev) => prev.filter((_, i) => i !== index));
  setFileList((prev) => prev.filter((_, i) => i !== index));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("category", category);

    fileList.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/posts`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      onAdd(response.data);
      onClose(); 

      Swal.fire({
        title: "Success!",
        text: "Item posted successfully! ✨",
        icon: "success",
        confirmButtonColor: "#ff85a2",
      });
    } catch (err: any) {
      console.error("Upload Error:", err.response?.data);
      Swal.fire({
        title: "Upload Failed",
        text: err.response?.data?.message || "Internal Server Error",
        icon: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card w-full max-w-lg bg-base-100 shadow-2xl p-6 relative border border-base-300">
      {/* SINGLE X BUTTON */}
      <button 
        onClick={onClose}
        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        type="button"
      >
        ✕
      </button>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center mb-2">List an Item</h2>

        <input
          type="text"
          placeholder="What are you giving away?"
          className="input input-bordered w-full"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          placeholder="Describe the item..."
          className="textarea textarea-bordered w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Pick-up Location"
          className="input input-bordered w-full"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />

        <select
          className="select select-bordered w-full"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <div className="form-control">
          <label className="label">
            <span className="label-text font-bold">Upload Photos</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            className="file-input file-input-bordered file-input-primary w-full"
            onChange={handleFiles}
          />
        </div>

        {/* PREVIEW BOX */}
        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto p-2 bg-base-200 rounded-lg">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
              <img 
                key={idx} 
                src={img} 
                className="w-16 h-16 object-cover rounded-md border-2 border-primary" 
                alt="preview" 
              />
              {/* THE REMOVE BUTTON */}
        <button
          type="button"
          onClick={() => removeFile(idx)}
          className="absolute -top-1 -right-1 bg-error text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-lg hover:scale-110 transition-transform"
        >
          ✕
        </button>
      </div>
            ))}
          </div>
        )}

        <button 
          type="submit" 
          className={`btn btn-primary w-full mt-4 ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? "Posting..." : "Confirm & Post"}
        </button>
      </form>
    </div>
  );
};

export default AddItemForm;