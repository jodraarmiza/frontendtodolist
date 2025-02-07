import React, { useState, useEffect } from "react";
import {
 Button, Input, VStack, HStack, List, ListItem, IconButton, Heading, Text, Spacer, Checkbox,
  useToast, Tag, TagLabel, TagLeftIcon, Container, Flex
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaClock, FaCalendarAlt, FaArrowLeft, FaArrowRight, FaSignOutAlt } from "react-icons/fa";
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
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      if (editingIndex !== null) {
        const updatedTasks = tasks.map((task) =>
          task.id === editingIndex
            ? { ...task, text: newTask, updatedAt: new Date().toLocaleString() }
            : task
        );
        setTasks(updatedTasks);
        setEditingIndex(null);

        toast({
          title: "Tugas Diperbarui!",
          description: "Tugas telah berhasil diperbarui.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
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

        toast({
          title: "Tugas Ditambahkan!",
          description: "Tugas baru berhasil ditambahkan.",
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top-right",
        });
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

    toast({
      title: "Tugas Dihapus!",
      description: "Tugas telah berhasil dihapus.",
      status: "warning",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
  };

  const handleEditTask = (taskId: number) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setNewTask(taskToEdit.text);
      setEditingIndex(taskId);
    }
  };

  const handleToggleComplete = (taskId: number) => {
    setTasks(tasks.map((task) => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
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
        <HStack>
          <FaClock />
          <Text fontSize="xl">Waktu Sekarang: {currentTime}</Text>
        </HStack>
      </VStack>

      <HStack justify="center" mb={6} w="full">
        <IconButton icon={<FaArrowLeft />} aria-label="Previous Day" onClick={() => setSelectedDate(subDays(selectedDate, 1))} size="lg" />
        <Text fontSize="2xl" fontWeight="bold">{format(selectedDate, "dd/MM/yyyy")}</Text>
        <IconButton icon={<FaArrowRight />} aria-label="Next Day" onClick={() => setSelectedDate(addDays(selectedDate, 1))} size="lg" />
      </HStack>

      <HStack mb={6} w="full">
        <Input placeholder="Tambah tugas..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={handleKeyPress} size="lg" />
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date || new Date())}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          customInput={<Button leftIcon={<FaCalendarAlt />} colorScheme="blue" size="lg">Pilih Tanggal</Button>}
        />
      </HStack>

      <Button colorScheme="green" width="full" onClick={handleAddTask} size="lg">
        {editingIndex !== null ? "Simpan" : "Tambah"}
      </Button>

      <List spacing={4} mt={6} w="full">
        {filteredTasks.length === 0 ? (
          <Text textAlign="center" color="gray.500" fontSize="xl">Tidak ada tugas untuk tanggal ini</Text>
        ) : (
          filteredTasks.map((task, index) => (
            <ListItem key={task.id} p={4} borderWidth={1} borderRadius="lg" w="full">
              <HStack w="full">
                <Text fontWeight="bold" fontSize="lg">#{index + 1}</Text>

                <Checkbox isChecked={task.completed} onChange={() => handleToggleComplete(task.id)} size="lg" colorScheme="green" />

                <Text fontSize="lg" textDecoration={task.completed ? "line-through" : "none"}>{task.text}</Text>

                <Tag size="md" colorScheme="blue">
                  <TagLeftIcon as={FaClock} />
                  <TagLabel>Dibuat: {task.createdAt} | Diedit: {task.updatedAt}</TagLabel>
                </Tag>

                <Spacer />
                <IconButton icon={<FaEdit />} aria-label="Edit" size="md" colorScheme="blue" onClick={() => handleEditTask(task.id)} />
                <IconButton icon={<FaTrash />} aria-label="Delete" size="md" colorScheme="red" onClick={() => handleDeleteTask(task.id)} />
              </HStack>
            </ListItem>
          ))
        )}
      </List>
    </Container>
  );
};

export default Home;
