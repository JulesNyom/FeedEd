"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SearchIcon,
  UsersIcon,
  FlameIcon,
  SnowflakeIcon,
  ChevronDownIcon,
  SendIcon,
} from "lucide-react";
import {
  useSurveyManagement,
  Program,
} from "@/lib/useSurveyManagement";

export type ResponseData = {
  envoye: number;
  relance: number;
}

const ResponseDetails: React.FC<{
  responsesChaud: ResponseData;
  reponsesFroid: ResponseData;
}> = ({ responsesChaud, reponsesFroid }) => {
  const [showChaud, setShowChaud] = useState(true);

  const responses = showChaud ? responsesChaud : reponsesFroid;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="w-fit p-4 space-y-4">
      <div className="flex items-center justify-between space-x-4">
        <span
          className={`text-sm font-medium ${
            showChaud ? "text-orange-500" : "text-gray-500"
          }`}>
          À chaud
        </span>
        <Switch
          checked={!showChaud}
          onCheckedChange={() => setShowChaud(!showChaud)}
          className="data-[state=checked]:bg-blue-500"
        />
        <span
          className={`text-sm font-medium ${
            !showChaud ? "text-blue-500" : "text-gray-500"
          }`}>
          À froid
        </span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={showChaud ? "chaud" : "froid"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-2">
          <h3 className="font-semibold mb-2">
            {showChaud ? "Réponses à chaud" : "Réponses à froid"}
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-green-100 dark:bg-green-900 p-2 rounded">
              <div className="text-sm">Envoyé :</div>
              <div className="text-sm font-semibold">{responses.envoye}</div>
            </div>
            <div className="flex justify-between items-center bg-red-100 dark:bg-red-900 p-2 rounded">
              <div className="text-sm">Relancé :</div>
              <div className="text-sm font-semibold">{responses.relance}</div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default function SurveyManagement() {
  const {
    programs,
    searchTerm,
    setSearchTerm,
    error,
    sendHotSurveys,
    sendColdSurveys,
  } = useSurveyManagement();

  const [sendingSurvey, setSendingSurvey] = useState<{
    [key: string]: boolean;
  }>({});

  const handleSendSurvey = async (programId: string, type: "hot" | "cold") => {
    setSendingSurvey((prev) => ({ ...prev, [programId]: true }));
    try {
      if (type === "hot") {
        await sendHotSurveys(programId);
      } else {
        await sendColdSurveys(programId);
      }
      console.log(`Sent ${type} survey for program ${programId}`);
    } catch (error) {
      console.error(`Error sending ${type} survey for program ${programId}:`, error);
    } finally {
      setSendingSurvey((prev) => ({ ...prev, [programId]: false }));
    }
  };

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-4 sm:p-6 space-y-4">
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-xl sm:text-2xl font-bold mb-4">
        Gestion des enquêtes
      </motion.h1>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-full">
          <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher une formation..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/hot">
              <Button className="mr-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 rounded-xl shadow-lg hover:to-red-600 text-white border-none flex-1 sm:flex-none">
                <FlameIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  Voir l&apos;enquête à chaud
                </span>
                <span className="sm:hidden">À chaud</span>
              </Button>
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/cold">
              <Button className="rounded-xl shadow-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white border-none flex-1 sm:flex-none">
                <SnowflakeIcon className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">
                  Voir l&apos;enquête à froid
                </span>
                <span className="sm:hidden">À froid</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Formation</TableHead>
              <TableHead className="text-center">Apprenants</TableHead>
              <TableHead className="text-center">Statuts</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programs.map((program: Program) => (
              <TableRow key={program.id}>
                <TableCell className="font-medium">{program.name}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center">
                    <UsersIcon className="h-4 w-4 mr-2 text-gray-500" />
                    {program.students.length}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Popover>
                    <PopoverTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center justify-center ">
                          <span className="mr-2">Voir détails</span>
                          <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-0">
                      <ResponseDetails
                        responsesChaud={program.reponsesChaud}
                        reponsesFroid={program.reponsesFroid}
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-block">
                        <Button
                          variant="outline"
                          size="sm"
                          className=""
                          disabled={sendingSurvey[program.id]}>
                          Envoyer
                          {sendingSurvey[program.id] ? (
                            <span className="animate-spin ml-2">⏳</span>
                          ) : (
                            <SendIcon className="h-4 w-4 ml-2" />
                          )}
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleSendSurvey(program.id, "hot")}>
                        <FlameIcon className="h-4 w-4 mr-2 text-orange-500" />
                        <span>Enquête à chaud</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSendSurvey(program.id, "cold")}>
                        <SnowflakeIcon className="h-4 w-4 mr-2 text-blue-500" />
                        <span>Enquête à froid</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </motion.div>
  );
}