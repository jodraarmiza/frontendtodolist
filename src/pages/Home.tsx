import React, { useState, useEffect } from "react";
import {
  Box, Button, Input, VStack, HStack, List, ListItem, IconButton, Heading, Text, Spacer, Checkbox,
  useToast, Tag, TagLabel, TagLeftIcon
} from "@chakra-ui/react";
import { FaTrash, FaEdit, FaClock, FaCalendarAlt, FaArrowLeft, FaArrowRight, FaSignOutAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Task {
  text: string;
  date: Date;
  createdAt: string;
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

  // ✅ Update jam real-time setiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(format(new Date(), "HH:mm:ss"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Fungsi Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  // ✅ Tambah / Edit Tugas untuk tanggal yang dipilih
  const handleAddTask = () => {
    if (newTask.trim() !== "") {
      if (editingIndex !== null) {
        const updatedTasks = tasks.map((task, index) =>
          index === editingIndex ? { ...task, text: newTask } : task
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
            text: newTask,
            date: selectedDate,
            completed: false,
            createdAt: format(new Date(), "dd/MM/yyyy HH:mm:ss"), // ✅ Simpan waktu dibuatnya
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

  // ✅ Fungsi Tambah Tugas dengan Tombol Enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask();
    }
  };

  // ✅ Hapus tugas tertentu
  const handleDeleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));

    toast({
      title: "Tugas Dihapus!",
      description: "Tugas telah berhasil dihapus.",
      status: "warning",
      duration: 2000,
      isClosable: true,
      position: "top-right",
    });
  };

  // ✅ Edit tugas
  const handleEditTask = (index: number) => {
    setNewTask(tasks[index].text);
    setEditingIndex(index);
  };

  // ✅ Toggle selesai/tidak selesai dengan warna hijau jika selesai
  const handleToggleComplete = (index: number) => {
    setTasks(tasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task)));
  };

  // ✅ Filter hanya tugas yang sesuai dengan tanggal yang dipilih
  const filteredTasks = tasks.filter((task) => isSameDay(task.date, selectedDate));

  return (
    <Box maxW="lg" mx="auto" py={8} px={4}>
      {/* Navbar dengan tombol Logout */}
      <HStack justify="space-between" mb={4}>
        <Heading>To-Do List</Heading>
        <Button colorScheme="red" leftIcon={<FaSignOutAlt />} onClick={handleLogout}>
          Logout
        </Button>
      </HStack>

      {/* Jam Real-Time */}
      <VStack mb={4}>
        <HStack>
          <FaClock />
          <Text fontSize="lg">Waktu Sekarang: {currentTime}</Text>
        </HStack>
      </VStack>

      {/* Navigasi Tanggal */}
      <HStack justify="center" mb={4}>
        <IconButton icon={<FaArrowLeft />} aria-label="Previous Day" onClick={() => setSelectedDate(subDays(selectedDate, 1))} />
        <Text fontSize="lg" fontWeight="bold">{format(selectedDate, "dd/MM/yyyy")}</Text>
        <IconButton icon={<FaArrowRight />} aria-label="Next Day" onClick={() => setSelectedDate(addDays(selectedDate, 1))} />
      </HStack>

      {/* Input & Kalender */}
      <HStack mb={4}>
        <Input placeholder="Tambah tugas..." value={newTask} onChange={(e) => setNewTask(e.target.value)} onKeyDown={handleKeyPress} />
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date || new Date())}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          customInput={<Button leftIcon={<FaCalendarAlt />} colorScheme="blue">Pilih Tanggal</Button>}
        />
      </HStack>

      {/* Tombol Tambah */}
      <Button colorScheme="green" width="full" onClick={handleAddTask}>
        {editingIndex !== null ? "Simpan" : "Tambah"}
      </Button>

      {/* Daftar Tugas */}
      <List spacing={3} mt={6}>
        {filteredTasks.length === 0 ? (
          <Text textAlign="center" color="gray.500">Tidak ada tugas untuk tanggal ini</Text>
        ) : (
          filteredTasks.map((task, index) => (
            <ListItem key={index} p={3} borderWidth={1} borderRadius="lg">
              <HStack>
                {/* Checkbox yang lebih besar dan berubah hijau saat selesai */}
                <Checkbox
                  isChecked={task.completed}
                  onChange={() => handleToggleComplete(index)}
                  size="lg"
                  colorScheme="green"
                />
                <Text textDecoration={task.completed ? "line-through" : "none"}>{task.text}</Text>

                {/* ✅ Tampilkan waktu dibuat */}
                <Tag size="sm" colorScheme="blue">
                  <TagLeftIcon as={FaClock} />
                  <TagLabel>{task.createdAt}</TagLabel>
                </Tag>

                <Spacer />
                <IconButton icon={<FaEdit />} aria-label="Edit" size="sm" colorScheme="blue" onClick={() => handleEditTask(index)} />
                <IconButton icon={<FaTrash />} aria-label="Delete" size="sm" colorScheme="red" onClick={() => handleDeleteTask(index)} />
              </HStack>
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
};

export default Home;
