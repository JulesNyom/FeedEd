import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the Training document
interface ITraining extends Document {
  name: string;
  duration: 'Formation longue' | 'Formation courte';
  numberOfLearners: number;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for the Training model
const trainingSchema = new Schema<ITraining>({
  name: {
    type: String,
    required: [true, 'Le nom de la formation est requis'],
    trim: true,
    unique: true,
  },
  duration: {
    type: String,
    required: [true, 'La durée de la formation est requise'],
    enum: ['Formation longue', 'Formation courte'],
  },
  numberOfLearners: {
    type: Number,
    required: [true, 'Le nombre d\'apprenants est requis'],
    min: [1, 'Le nombre d\'apprenants doit être au moins 1'],
    max: [200, 'Le nombre d\'apprenants ne peut pas dépasser 200'],
  },
}, {
  timestamps: true, // This will add createdAt and updatedAt fields
});

// Create and export the model
export const Training = mongoose.model<ITraining>('Training', trainingSchema);