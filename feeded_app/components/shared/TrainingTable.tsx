import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Training {
  name: string;
  duration: 'Formation longue' | 'Formation courte';
  numberOfLearners: number;
  createdAt: Date;
}

const trainings: Training[] = [
  {
    name: "Formation React",
    duration: "Formation longue",
    numberOfLearners: 15,
    createdAt: new Date("2023-01-15"),
  },
  {
    name: "Atelier UX Design",
    duration: "Formation courte",
    numberOfLearners: 20,
    createdAt: new Date("2023-02-01"),
  },
  {
    name: "Cours Python Avancé",
    duration: "Formation longue",
    numberOfLearners: 25,
    createdAt: new Date("2023-03-10"),
  },
  {
    name: "Séminaire Gestion de Projet",
    duration: "Formation courte",
    numberOfLearners: 30,
    createdAt: new Date("2023-04-05"),
  },
  {
    name: "Initiation à l'IA",
    duration: "Formation courte",
    numberOfLearners: 18,
    createdAt: new Date("2023-05-20"),
  },
];

export function TrainingTable() {
  return (
    <div className="container rounded-3xl mx-auto py-10 px-4">
      <h2 className="text-3xl font-bold mb-6 text-purple-800">Formations</h2>
      <div className="bg-transparent overflow-hidden p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-purple-100 border-none rounded-full mb-4">
              <TableHead className="py-3 px-6 text-center text-xs font-medium text-purple-700 uppercase tracking-wider rounded-l-full">Nom</TableHead>
              <TableHead className="py-3 px-6 text-center text-xs font-medium text-purple-700 uppercase tracking-wider">Durée</TableHead>
              <TableHead className="py-3 px-6 text-center text-xs font-medium text-purple-700 uppercase tracking-wider">Apprenants</TableHead>
              <TableHead className="py-3 px-6 text-center text-xs font-medium text-purple-700 uppercase tracking-wider rounded-r-full">Date de création</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trainings.map((training, index) => (
              <TableRow 
                key={training.name} 
                className="border-none"
              >
                <TableCell className="py-4 px-6 text-center whitespace-nowrap text-sm font-medium">{training.name}</TableCell>
                <TableCell className="py-4 text-center px-6 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 text-center inline-flex text-xs leading-5 font-semibold rounded-full ${
                    training.duration === 'Formation longue' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {training.duration}
                  </span>
                </TableCell>
                <TableCell className="py-4 px-6 whitespace-nowrap text-sm text-center text-purple-700">{training.numberOfLearners}</TableCell>
                <TableCell className="py-4 px-6 whitespace-nowrap text-sm text-center  text-purple-700">
                  {training.createdAt.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}