'use client'

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from 'lucide-react'

type Training = {
  id: number
  nom: string
  apprenants: number
  duree: string
  statut: 'En cours' | 'Terminé' | 'À venir'
}

const initialData: Training[] = [
  { id: 1, nom: "Introduction à React", apprenants: 25, duree: "2 semaines", statut: "En cours" },
  { id: 2, nom: "JavaScript Avancé", apprenants: 18, duree: "3 semaines", statut: "Terminé" },
  { id: 3, nom: "UX Design Principles", apprenants: 30, duree: "4 semaines", statut: "À venir" },
  { id: 4, nom: "Node.js Fundamentals", apprenants: 22, duree: "3 semaines", statut: "En cours" },
  { id: 5, nom: "Data Visualization with D3", apprenants: 15, duree: "2 semaines", statut: "À venir" },
]

export default function TrainingTable() {
  const [data, setData] = useState<Training[]>(initialData)
  const [sortColumn, setSortColumn] = useState<keyof Training | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const sortData = (column: keyof Training) => {
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortDirection(newDirection)
    setSortColumn(column)

    const sortedData = [...data].sort((a, b) => {
      if (a[column] < b[column]) return newDirection === 'asc' ? -1 : 1
      if (a[column] > b[column]) return newDirection === 'asc' ? 1 : -1
      return 0
    })

    setData(sortedData)
  }

  const getStatusColor = (status: Training['statut']) => {
    switch (status) {
      case 'En cours':
        return 'bg-blue-100 text-blue-800'
      case 'Terminé':
        return 'bg-green-100 text-green-800'
      case 'À venir':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="m-6 w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">
              <Button variant="ghost" onClick={() => sortData('nom')}>
                Nom <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" onClick={() => sortData('apprenants')}>
                Nombre d'apprenants <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" onClick={() => sortData('duree')}>
                Durée <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" onClick={() => sortData('statut')}>
                Statut <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((training) => (
            <TableRow key={training.id}>
              <TableCell className="font-medium">{training.nom}</TableCell>
              <TableCell className="text-right">{training.apprenants}</TableCell>
              <TableCell className="text-right">{training.duree}</TableCell>
              <TableCell className="text-right">
                <Badge className={getStatusColor(training.statut)}>{training.statut}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}