import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Card,
} from "react-bootstrap";
import { FaCalendarAlt, FaClock, FaUserMd, FaClipboard } from "react-icons/fa";
import { fetchDoctorAvailability } from "../../axios/availabilityAxios";
import { fetchDoctors } from "../../axios/doctorAxios";

// Add custom styles
const calendarStyles = `
  .available-date {
    background-color: #e6ffe6;
    color: #006600;
    font-weight: bold;
  }
  .react-calendar__tile:disabled {
    background-color: #f0f0f0;
    color: #cccccc;
  }
`;

// Add style tag to the component
function BookAppointment() {
  // Add new state for doctors
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = calendarStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [form, setForm] = useState({ doctor: "", reason: "" });
  const [confirmed, setConfirmed] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);

  // Fetch availability for the selected doctor
  const fetchAvailability = async (doctorId) => {
    console.log("Fetching availability for doctorId:", doctorId);
    try {
      if (!doctorId) {
        setAvailability([]);
        setAvailableDates([]);
        return;
      }

      const data = await fetchDoctorAvailability(doctorId);
      console.log("Received availability data:", data); // Add this line

      if (data && data.length > 0) {
        setAvailability(data);
        const dates = [
          ...new Set(data.map((slot) => new Date(slot.date).toDateString())),
        ];
        console.log("Available dates:", dates); // Add this line
        setAvailableDates(dates);
      } else {
        console.log("No availability data found"); // Add this line
        setAvailability([]);
        setAvailableDates([]);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      setAvailability([]);
      setAvailableDates([]);
    }
  };

  // Load doctors when component mounts
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await fetchDoctors();
        // Make sure we're setting an array
        setDoctors(response.data || []);
      } catch (error) {
        console.error("Error loading doctors:", error);
        setDoctors([]); // Set empty array on error
      }
    };
    loadDoctors();
  }, []);

  // Add this console.log to debug
  console.log("Doctors state:", doctors);

  // Handle form changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    // Fetch availability when a doctor is selected
    if (e.target.name === "doctor") {
      console.log("Doctor selected:", e.target.value); // Debugging
      fetchAvailability(e.target.value);
    }
  };

  // Filter available times for the selected date
  const filterAvailableTimes = () => {
    console.log("Filtering times for selected date:", selectedDate); // Debugging
    const times = [];
    availability.forEach((slot) => {
      const slotDate = new Date(slot.date).toDateString();
      const selectedDateString = selectedDate.toDateString();

      if (slotDate === selectedDateString) {
        times.push(`${slot.start} - ${slot.end}`);
      }
    });
    console.log("Filtered times:", times); // Debugging
    setAvailableTimes(times);
  };

  // Update available times when selectedDate or availability changes
  useEffect(() => {
    console.log("Availability state updated:", availability); // Debugging
    filterAvailableTimes();
  }, [selectedDate, availability]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedTime) {
      alert("Please select a time.");
      return;
    }

    const datetime = new Date(selectedDate);
    const timeParts = selectedTime.match(/(\d+):(\d+)\s?(AM|PM)/i);
    let hours = parseInt(timeParts[1], 10);
    const minutes = parseInt(timeParts[2], 10);
    const ampm = timeParts[3].toUpperCase();

    if (ampm === "PM" && hours !== 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;

    datetime.setHours(hours);
    datetime.setMinutes(minutes);

    console.log("Appointment booked:", {
      ...form,
      date: datetime.toLocaleString(),
    });

    setConfirmed(true);
  };

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      // Disable dates that aren't in availableDates and past dates
      const isUnavailable = !availableDates.includes(date.toDateString());
      const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
      return isUnavailable || isPastDate;
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month" && availableDates.includes(date.toDateString())) {
      return "available-date";
    }
    return null;
  };

  return (
    <Container className="mt-5">
      <h3 className="text-center mb-4">Book an Appointment</h3>

      {confirmed && (
        <Alert variant="success" className="text-center">
          Appointment booked successfully!
        </Alert>
      )}

      <Card className="p-4 shadow-lg">
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>
                  Select a Doctor <FaUserMd />
                </Form.Label>
                <Form.Select
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Choose your Doctor --</option>
                  {Array.isArray(doctors) &&
                    doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name}
                      </option>
                    ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  Reason for Visit <FaClipboard />
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  required
                  placeholder="Enter the reason for your visit..."
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>
                      Select a Date <FaCalendarAlt />
                    </Form.Label>
                    <Calendar
                      onChange={setSelectedDate}
                      value={selectedDate}
                      className="w-100"
                      tileDisabled={tileDisabled}
                      tileClassName={tileClassName}
                      minDate={new Date()}
                    />
                  </Form.Group>
                </Col>

                <Col md={12}>
                  <Form.Group>
                    <Form.Label>
                      Select a Time <FaClock />
                    </Form.Label>
                    <Form.Select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      required
                    >
                      <option value="">-- Choose Time --</option>
                      {availableTimes.map((time, idx) => (
                        <option key={idx} value={time}>
                          {time}
                        </option>
                      ))}
                    </Form.Select>

                    <p>Available times: {JSON.stringify(availableTimes)}</p>
                  </Form.Group>
                </Col>
              </Row>

              <p className="mt-3">
                <strong>Selected Appointment:</strong>{" "}
                {selectedDate.toDateString()} at {selectedTime}
              </p>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button type="submit" variant="primary" size="lg">
              Book Appointment
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
  );
}

export default BookAppointment;
