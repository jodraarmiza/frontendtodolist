import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  List,
  ListItem,
  IconButton,
  Heading,
  Text,
  Spacer,
  Checkbox,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import {
  FaTrash,
  FaEdit,
  FaClock,
  FaCalendarAlt,
  FaArrowLeft,
  FaArrowRight,
  FaSignOutAlt,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, addDays, subDays, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";

interface Task {
  text: string;
  date: Date;
  completed: boolean;
}

const Home = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");

  // ✅ State untuk Hapus Semua
  const [isClearOpen, setIsClearOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

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
      } else {
        setTasks([...tasks, { text: newTask, date: selectedDate, completed: false }]);
      }
      setNewTask(""); // ✅ Kosongkan input setelah ditambahkan
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
  };

  // ✅ Edit tugas
  const handleEditTask = (index: number) => {
    setNewTask(tasks[index].text);
    setEditingIndex(index);
  };

  // ✅ Toggle selesai/tidak selesai
  const handleToggleComplete = (index: number) => {
    setTasks(tasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task)));
  };

  // ✅ Hapus semua tugas pada tanggal yang dipilih
  const handleClearAll = () => {
    setTasks(tasks.filter((task) => !isSameDay(task.date, selectedDate)));
    setIsClearOpen(false);
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
        <IconButton
          icon={<FaArrowLeft />}
          aria-label="Previous Day"
          onClick={() => setSelectedDate(subDays(selectedDate, 1))}
        />
        <Text fontSize="lg" fontWeight="bold">
          {format(selectedDate, "dd/MM/yyyy")}
        </Text>
        <IconButton
          icon={<FaArrowRight />}
          aria-label="Next Day"
          onClick={() => setSelectedDate(addDays(selectedDate, 1))}
        />
      </HStack>

      {/* Input & Kalender */}
      <HStack mb={4}>
        <Input
          placeholder="Tambah tugas..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={handleKeyPress} // ✅ Klik Enter untuk tambah tugas
        />
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => setSelectedDate(date || new Date())}
          dateFormat="dd/MM/yyyy"
          minDate={new Date()}
          customInput={
            <Button leftIcon={<FaCalendarAlt />} colorScheme="blue">
              Pilih Tanggal
            </Button>
          }
        />
      </HStack>

      {/* Tombol Tambah & Hapus Semua */}
      <HStack w="100%">
        <Button colorScheme="green" onClick={handleAddTask}>
          {editingIndex !== null ? "Simpan" : "Tambah"}
        </Button>
        <Spacer />
        {filteredTasks.length > 0 && (
          <Button colorScheme="red" size="sm" onClick={() => setIsClearOpen(true)}>
            Hapus Semua Tugas
          </Button>
        )}
      </HStack>

      {/* Daftar Tugas */}
      <List spacing={3} mt={6}>
        {filteredTasks.length === 0 ? (
          <Text textAlign="center" color="gray.500">
            Tidak ada tugas untuk tanggal ini
          </Text>
        ) : (
          filteredTasks.map((task, index) => (
            <ListItem key={index} p={3} borderWidth={1} borderRadius="lg">
              <HStack>
                {/* Checkbox untuk menandai selesai */}
                <Checkbox isChecked={task.completed} onChange={() => handleToggleComplete(index)} />
                <Text textDecoration={task.completed ? "line-through" : "none"}>{task.text}</Text>
                <Spacer />
                <IconButton icon={<FaEdit />} aria-label="Edit" size="sm" colorScheme="blue" onClick={() => handleEditTask(index)} />
                <IconButton icon={<FaTrash />} aria-label="Delete" size="sm" colorScheme="red" onClick={() => handleDeleteTask(index)} />
              </HStack>
            </ListItem>
          ))
        )}
      </List>

      {/* Alert Konfirmasi "Clear All" */}
      <AlertDialog isOpen={isClearOpen} leastDestructiveRef={cancelRef} onClose={() => setIsClearOpen(false)}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Hapus Semua Tugas</AlertDialogHeader>
            <AlertDialogBody>Apakah Anda yakin ingin menghapus semua tugas untuk tanggal ini?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsClearOpen(false)}>Batal</Button>
              <Button colorScheme="red" onClick={handleClearAll} ml={3}>Hapus Semua</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default Home;
``