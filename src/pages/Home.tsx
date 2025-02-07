import React, { useState } from "react";
import {
  Button, Input, VStack, HStack, List, ListItem, IconButton, Heading, Text, Spacer, Checkbox,
  useToast, Container, Flex, AlertDialog, AlertDialogOverlay,
  AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaCalendarAlt, FaArrowLeft, FaArrowRight, FaSignOutAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Task {
  id: number;
  text: string;
  date: Date;
  createdAt: string;
  updatedAt: string;
  completed: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isClearOpen, setIsClearOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const today = new Date(); // Mendapatkan tanggal hari ini

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      if (editingTask) {
        const updatedTasks = tasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, text: newTask, updatedAt: new Date().toLocaleString() }
            : task
        );
        setTasks(updatedTasks);
        setEditingTask(null);
        toast({ title: "Tugas Diperbarui!", status: "success", duration: 2000, isClosable: true });
      } else {
        setTasks([
          ...tasks,
          {
            id: tasks.length + 1,
            text: newTask,
            date: selectedDate,
            completed: false,
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString(),
          },
        ]);
        toast({ title: "Tugas Ditambahkan!", status: "success", duration: 2000, isClosable: true });
      }
      setNewTask("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask();
    }
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prevTasks => prevTasks.filter((task) => task.id !== taskId));
    toast({ title: "Tugas Dihapus!", status: "warning", duration: 2000, isClosable: true });
  };

  const handleEditTask = (task: Task) => {
    setNewTask(task.text);
    setEditingTask(task);
  };

  const handleClearAll = () => {
    setTasks(prevTasks => prevTasks.filter(task => !isSameDay(task.date, selectedDate)));
    setIsClearOpen(false);
    toast({
      title: "Semua Tugas Dihapus!",
      description: `Semua tugas untuk tanggal ${format(selectedDate, "dd/MM/yyyy")} telah dihapus.`,
      status: "error",
      duration: 2000,
      isClosable: true,
    });
  };

  const filteredTasks = tasks.filter((task) => isSameDay(task.date, selectedDate));

  return (
    <Container maxW="container.xl" py={8} px={4}>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="xl">To-Do List</Heading>
        <Button colorScheme="red" leftIcon={<FaSignOutAlt />} onClick={handleLogout} size="lg">
          Logout
        </Button>
      </Flex>

      <VStack mb={4}>
        <Text fontSize="xl" fontWeight="bold">
          Tanggal yang Dipilih: {format(selectedDate, "EEEE, dd MMMM yyyy")}
        </Text>
      </VStack>

      <HStack justify="center" mb={6} w="full">
        <IconButton icon={<FaArrowLeft />} aria-label="Previous Day" onClick={() => setSelectedDate(subDays(selectedDate, 1))} size="lg" />
        
        {/* ✅ Menandai Tanggal Hari Ini di Kalender */}
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date || new Date())}
          dateFormat="dd/MM/yyyy"
          customInput={<Button leftIcon={<FaCalendarAlt />} colorScheme="blue" size="lg">Pilih Tanggal</Button>}
          dayClassName={(date) =>
            isSameDay(date, today) ? "today-highlight" : "" // Tambahkan class khusus untuk tanggal hari ini
          }
        />

        <IconButton icon={<FaArrowRight />} aria-label="Next Day" onClick={() => setSelectedDate(addDays(selectedDate, 1))} size="lg" />
      </HStack>

      <HStack mb={6} w="full">
        <Input 
          placeholder="Tambah tugas..." 
          value={newTask} 
          onChange={(e) => setNewTask(e.target.value)} 
          onKeyDown={handleKeyPress} 
          size="lg" 
        />
        <Button colorScheme="red" size="lg" onClick={() => setIsClearOpen(true)}>Hapus Semua</Button>
      </HStack>

      <Button colorScheme="green" width="full" onClick={handleAddTask} size="lg">
        {editingTask ? "Simpan" : "Tambah"}
      </Button>

      <List spacing={4} mt={6} w="full">
        {filteredTasks.map((task, index) => (
          <ListItem key={task.id} p={4} borderWidth={1} borderRadius="lg" w="full">
            <HStack w="full">
              <Text fontWeight="bold" fontSize="lg">#{index + 1}</Text>
              <Checkbox isChecked={task.completed} size="lg" colorScheme="green" />
              <VStack align="start">
                <Text fontSize="lg">{task.text}</Text>
                <Text fontSize="sm" color="gray.500">
                  Dibuat: {task.createdAt} | Diedit: {task.updatedAt}
                </Text>
              </VStack>
              <Spacer />
              <IconButton icon={<FaEdit />} aria-label="Edit Task" size="md" colorScheme="blue" onClick={() => handleEditTask(task)} />
              <IconButton icon={<FaTrash />} aria-label="Delete Task" size="md" colorScheme="red" onClick={() => handleDeleteTask(task.id)} />
            </HStack>
          </ListItem>
        ))}
      </List>

      <AlertDialog isOpen={isClearOpen} leastDestructiveRef={cancelRef} onClose={() => setIsClearOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Hapus Semua Tugas?</AlertDialogHeader>
            <AlertDialogBody>Anda yakin ingin menghapus semua tugas?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsClearOpen(false)}>Batal</Button>
              <Button colorScheme="red" onClick={handleClearAll} ml={3}>Hapus</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {/* ✅ Tambahkan CSS untuk menyorot tanggal hari ini */}
      <style>
        {`
          .today-highlight {
            font-weight: bold;
            color: #007bff !important;
          }
        `}
      </style>
    </Container>
  );
};

export default Home;
