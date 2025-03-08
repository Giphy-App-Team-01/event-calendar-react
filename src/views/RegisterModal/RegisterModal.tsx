import React, { useState } from "react";
import { uploadImageToCloudinary } from "../../services/upload-service";
import defaultAvatar from "../../assets/images/default-avatar.jpg";
import { validateEmail, validateFirstAndLastName, validatePhoneNumber, validateUsername, validatePassword, validatePasswordsMatch, validateAddress } from "../../utils/validationHelpers";
import { toast } from "react-toastify";
import { registerUser } from "../../services/auth-service";
import { saveUserToDatabase } from "../../services/db-service";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ isOpen, onClose }) => {
  const [image, setImage] = useState(defaultAvatar);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setUploading(true);
      const uploadedImageUrl = await uploadImageToCloudinary(selectedFile);
      if (uploadedImageUrl) {
        setImage(uploadedImageUrl);
      }
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      validateFirstAndLastName(formData.firstName, formData.lastName);
      await validateUsername(formData.username);
      await validatePhoneNumber(formData.phoneNumber);
      await validateEmail(formData.email);
      validatePassword(formData.password);
      validatePasswordsMatch(formData.password, formData.confirmPassword);
      validateAddress(formData.address);

      setLoading(true);

      const userCredential = await registerUser(formData.email, formData.password);
      const user = userCredential.user;
      await saveUserToDatabase(
        user.uid,
        formData.firstName,
        formData.lastName,
        formData.phoneNumber,
        formData.address,
        formData.email,
        formData.username,
        image
      );
      toast.success("Registration successful",{
        autoClose: 1000
      });
      onClose();
      navigate("/my-calendar");
    } catch (error) {
      toast.error((error as Error).message,{
        autoClose:2000,
      });
    } finally{
      setLoading(false);
    }
  };

  interface FormField {
    label: string;
    name: keyof typeof formData;
    type?: string;
  }

  const formFields: FormField[] = [
    { label: "First Name", name: "firstName" },
    { label: "Last Name", name: "lastName" },
    { label: "Username", name: "username" },
    { label: "Phone Number", name: "phoneNumber" },
    { label: "Address", name: "address" },
    { label: "Email", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
    { label: "Confirm Password", name: "confirmPassword", type: "password" },
  ];

  return (
    <div className={`modal ${isOpen ? "modal-open" : ""}`}>
      <div className="modal-box bg-gray-50 shadow-lg rounded-xl p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Register</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center">
            <div
              className="relative w-20 h-20 rounded-full border border-gray-300 overflow-hidden cursor-pointer"
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <img src={image || defaultAvatar} alt="Profile" className="w-full h-full object-cover" />
              {uploading && <div className="absolute inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center text-white">Uploading...</div>}
            </div>
            <input id="fileInput" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {formFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type || "text"}
                  placeholder={field.label}
                  value={formData[field.name]}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  className="input input-bordered w-full bg-white border-gray-300 text-black placeholder-gray-600 rounded-lg p-2"
                  required
                />
              </div>
            ))}
          </div>
          <Button type="submit" className="btn w-full text-lg font-medium rounded-lg shadow-md bg-blue-400 hover:bg-blue-500 transition-all text-white">
            {loading ? "Loading..." : "Register"}
          </Button>
        </form>

        <div className="modal-action flex justify-center mt-4">
          <Button className="btn btn-outline px-6 py-2 rounded-lg text-gray-600 border-gray-400 hover:bg-gray-200" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;