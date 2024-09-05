import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TrainingCard () {
  return (
    <div className="flex justify-center items-center min-h-screen">
    <Card className="w-[350px] shadow-xl border-none">
      <CardHeader>
        <CardTitle className="text-purple">Créer une formation</CardTitle>
        <CardDescription>Complétez les champs nécessaires.</CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4 space-y-1.5">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="font-semibold">Nom de la formation</Label>
              <Input id="name" placeholder="Nom" />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework" className="font-semibold">Durée de la formation</Label>
              <Select>
                <SelectTrigger id="framework">
                  <SelectValue placeholder="Durée" />
                </SelectTrigger>
                <SelectContent position="popper">
                  <SelectItem value="next">Formation longue</SelectItem>
                  <SelectItem value="sveltekit">Formation courte</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name" className="font-semibold">Nombre d'apprenants</Label>
              <Input id="name" placeholder="de 1 à 200" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" className="bg-purple rounded-lg font-semibold text-white">Supprimer</Button>
        <Button className="rounded-lg border-transparent bg-yellow font-semibold">Créer</Button>
      </CardFooter>
    </Card>
    </div>
  )
}
