import React, { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { db } from '@/firebase';  // Assurez-vous que ce chemin est correct
import { useAuth } from '@/context/AuthContext';  // Assurez-vous que ce chemin est correct

interface AvatarUploadProps {
  utilisateur: {
    firstName: string;
    lastName: string;
    profilePicture: string;
  };
  onMiseAJour: (nouveauUtilisateur: { profilePicture: string }) => void;
}

export function AvatarUpload({ utilisateur, onMiseAJour }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentUser } = useAuth();

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    setUploading(true);

    try {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePictures/${currentUser.uid}`);
            
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);
      
      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update the user's profile picture URL in Firestore
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        profilePicture: downloadURL
      });

      // Update local state
      onMiseAJour({ profilePicture: downloadURL });
    } catch (error) {
      console.error("Error uploading file: ", error);
      // Here you might want to show an error message to the user
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Avatar className="h-24 w-24 cursor-pointer" onClick={handleAvatarClick}>
        <AvatarImage src={utilisateur.profilePicture} alt={`${utilisateur.firstName} ${utilisateur.lastName}`} />
        <AvatarFallback>{utilisateur.firstName[0]}{utilisateur.lastName[0]}</AvatarFallback>
      </Avatar>
      {uploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
          <div className="loader"></div> {/* You'll need to style this */}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}