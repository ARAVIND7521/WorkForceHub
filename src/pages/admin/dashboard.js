import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import Calendar from 'react-calendar';
import moment from 'moment';
import useToken from '../../components/token';
import Header from "../../components/Admin/Header";
import Footer from "../../components/Admin/Footer";

function Dashboard() {
    const {token} = useToken();
    const navigate = useNavigate();
    const ref_show = useRef(null);
    const ref_show_close2 = useRef(null);
    const ref_absentees_close3 = useRef(null);;
    const ref_calendar = useRef(null);
    const ref_absentees = useRef(null);
    const ref_dashboard = useRef(null);
    const ref_tooltip = useRef(null);
    const ref_tooltip_button1 = useRef(null);
    const ref_tooltip_button2 = useRef(null);
    const [date, setDate] = useState(new Date());
    const [empname, SetEmpName] = useState("");
    const [specialEmp, SetSpecialEmp] = useState("");
    const [userData, setUserData] = useState("");
    const [userData_absentees, setUserData_absentees] = useState("");
    const [empid, setEmpid] = useState("");
    const [empId, setEmpID] = useState("");
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");
    const [Designation, setDesignation] = useState("");
    const [DOJ, setDOJ] = useState("");
    const [Experience, setExperience] = useState("");
    const [Address, setAddress] = useState("");
    const [Zipcode, setZipcode] = useState("");
    const [MobileNO, setMobileNO] = useState("");
    const [Profile, setProfile] = useState("");
    const [membersPresent, setMembersPresent] = useState(0);
    const [membersAbsent, setMembersAbsent] = useState(0);
    const [selectedDateStatus, setSelectedDateStatus] = useState(null);
    const [presentCollector, setPresentCollector] = useState({});
    const [dateCollector, setDateCollector] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
    const modeMap = {
        1: "Remote",
        2: "In-office",
        3: "Hybird",
        4: "Leave"
    };

    useEffect(() => {
        Axios.post(`http://localhost:3000/dashboard/`, {
            empid: empid,
        }).then((response => {
            if (response.status === 200) {
                setUserData(response.data);
            }
        })).catch(handleAxiosError)
    }, [token]);

    function handleAxiosError(error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    }

    useEffect(() => {
        // setspecialYear(year.toString().substring(11, 15));
        Axios.post(`http://localhost:3000/birth_date/`, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            }
        }).then((response => {
            const dataItem = response.data;
            const data = response.data[0];
            SetSpecialEmp(dataItem);
            setEmpID(data);
            setFirstname(data);
            setLastname(data);
            setExperience(data);
            setDesignation(data);
            setDOJ(data);
            setAddress(data);
            setZipcode(data);
            setMobileNO(data);
            setProfile(data);
        })).catch(handleAxiosError)
    }, [token])

    function Show_details() {
        const show = ref_show.current;
        show.style.display = "block";
        const span = ref_show_close2.current;
        span.onclick = function () {
            show.style.display = "none";
        }
    }

    useEffect(() => {
        if (!localStorage.getItem("secretID")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        Axios.post(`http://localhost:3000/attendance_list/`, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            const data = response.data;
            const dateCounts = {};
            const presentCounts = {};
            for (let list in data) {
                let date = moment(data[list].Date).format('YYYY-MM-DD');
                let mode = data[list].mode;
                let status = data[list].Status;
                let attendance_status = data[list].attendance_status;
                if (mode === 4 && status == "Accept" && attendance_status == "Absent") {
                    if (!dateCounts[date]) {
                        dateCounts[date] = 1;
                    } else {
                        dateCounts[date]++;
                        if (dateCounts[date] >= 5) {
                            setDateCollector(dateCounts);
                        }
                    }
                }

                if (attendance_status == "Present") {
                    if (!presentCounts[date]) {
                        presentCounts[date] = 1;
                    } else {
                        presentCounts[date]++;
                        if (presentCounts[date] == userData.length) {
                            setPresentCollector(presentCounts);
                        }
                    }
                }
            }
        }).catch(handleAxiosError);
    }, [userData]);

    const handleDateClick = (selectedDate, event) => {
        setDate(selectedDate);
        datepicker(selectedDate);
        setSelectedDate(date);
        const rect = event.target.getBoundingClientRect();
        setTooltipPosition({ x: rect.left, y: rect.top });
    };

    function datepicker(selectedDate) {
        Axios.post(`http://localhost:3000/absentees_list/`, {
            date: moment(selectedDate).format('YYYY-MM-DD'),
            attendance_status: "Present",
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((responsePresent) => {
            setMembersPresent(responsePresent.data.length);

            Axios.post(`http://localhost:3000/absentees_list/`, {
                date: moment(selectedDate).format('YYYY-MM-DD'),
                attendance_status: "Absent",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((responseAbsent) => {
                setMembersAbsent(responseAbsent.data.length);
                const button_Present = ref_tooltip_button1.current;
                const button_Absent = ref_tooltip_button2.current;
                button_Present.style.display = "block";
                button_Absent.style.display = "block";
                const tooltip = ref_tooltip.current;
                if (responsePresent.data.length == 0 && responseAbsent.data.length == 0) {
                    button_Present.style.display = "none";
                    button_Absent.style.display = "none";
                }
                if (responseAbsent.data.length == 0) {
                    button_Absent.style.display = "none";
                }
                if (responsePresent.data.length == 0) {
                    button_Present.style.display = "none";
                }
                if (responsePresent.data.length > 0 || responseAbsent.data.length > 0) {
                    tooltip.style.display = "block";
                } else {
                    tooltip.style.display = "none";
                }
            }).catch(handleAxiosError);
        }).catch(handleAxiosError);
    }

    function handleStatusChange(status) {
        const tooltip = ref_tooltip.current;
        setSelectedDateStatus(status);
        if (status === "Present") {
            Axios.post(`http://localhost:3000/absentees_list/`, {
                date: moment(date).format('YYYY-MM-DD'),
                attendance_status: "Present",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((responseAbsent) => {
                setUserData_absentees(responseAbsent.data);
                tooltip.style.display = "none";
            }).catch(handleAxiosError);
        } else if (status === "Absent") {
            Axios.post(`http://localhost:3000/absentees_list/`, {
                date: moment(date).format('YYYY-MM-DD'),
                attendance_status: "Absent",
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((responseAbsent) => {
                setUserData_absentees(responseAbsent.data);
                tooltip.style.display = "none";
            }).catch(handleAxiosError);
        }

        const absentees = ref_absentees.current;
        absentees.style.display = "block";
        const span = ref_absentees_close3.current;
        span.onclick = function () {
            absentees.style.display = "none";
        }
    }

    function customTileContent({ date }) {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        if (dateCollector[formattedDate] && dateCollector[formattedDate] >= 5) {
            return <div className="highlighted-date">{date.getDate()}</div>;
        }
        if (presentCollector[formattedDate] && presentCollector[formattedDate] == userData.length) {
            return <div className="highlighted-present">{date.getDate()}</div>;
        }
        return null;
    }

    return (
        <>
            <div id="full_frame">
                <Header />
                <div ref={ref_show} className="modal">
                    <div className="modal-content">
                        <span ref={ref_show_close2} className="close">&times;</span>
                        <div className="showing">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>EMPID</th>
                                        <th>EMPLOYEE NAME</th>
                                        <th>DESIGNATION</th>
                                    </tr>
                                </tbody>
                                <tbody>
                                    {
                                        Object.keys(userData).map((item, index) => {
                                            return (
                                                <tr item={item} key={index} index={index}>
                                                    <td>{userData[index].EmpID}</td>
                                                    <td>{userData[index].First_Name + " " + userData[index].Last_Name}</td>
                                                    <td>{userData[index].Designation}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div ref={ref_absentees} className="modal">
                    <div className="modal-content">
                        <span ref={ref_absentees_close3} className="close">&times;</span>
                        <div className="showing">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>EMPID</th>
                                        <th>EMPLOYEE NAME</th>
                                        {/* <th>DESIGNATION</th> */}
                                        <th>DATE</th>
                                        <th>STATUS</th>
                                        <th>MODE</th>
                                    </tr>
                                </tbody>
                                <tbody>
                                    {
                                        Object.keys(userData_absentees).map((item, index) => {
                                            return (
                                                <tr item={item} key={index} index={index}>
                                                    <td>{userData_absentees[index].empid}</td>
                                                    <td>{userData_absentees[index].First_name + " " + userData_absentees[index].last_name}</td>
                                                    {/* <td>{userData_absentees[index].Designation}</td> */}
                                                    <td>{new Date(userData_absentees[index].date).toLocaleDateString("es-CL")}</td>
                                                    <td>{userData_absentees[index].status}</td>
                                                    <td>{modeMap[userData_absentees[index].mode]}</td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div ref={ref_dashboard} id="body_admin">
                    <div className='app'>
                        <h1 className='text-center'>Calendar</h1>
                        <div className='calendar-container'>
                            <Calendar ref={ref_calendar}
                                onChange={setDate}
                                tileContent={customTileContent}
                                maxDate={new Date()}
                                minDate={new Date(1990, 1, 1)}
                                value={date} onClickDay={(clickedDate, event) => handleDateClick(clickedDate, event)}
                            />
                            <div ref={ref_tooltip} className="tooltip-content" style={{ top: tooltipPosition.y, left: tooltipPosition.x }}>
                                <button ref={ref_tooltip_button1} onClick={() => { handleStatusChange("Present") }}>Present ({membersPresent})</button>
                                <button ref={ref_tooltip_button2} onClick={() => { handleStatusChange("Absent") }}>Leave ({membersAbsent})</button>
                            </div>
                        </div>
                    </div>
                    <div id="dashborad">
                        <h2 id="Spec_Employee_len">Birthday</h2>
                        <div id="specialEmployeeList">
                            {
                                Object.keys(specialEmp).map((item, index) => {
                                    return (
                                        <div className="birthdayCard" key={index}>
                                            <div className="profileImageContainer">
                                                <img className="profileImage"
                                                    src={`http://localhost:3000/images/` + specialEmp[index].Profile} width={"50px"} height={"80px"}>
                                                </img>
                                            </div>
                                            <div className="employeeDetails">
                                                <p className="employeeID-birthcard"><b>EMP ID:</b>{specialEmp[index].EmpID}</p>
                                                <p className="employeeName">{specialEmp[index].First_Name + " " + specialEmp[index].Last_Name}</p>
                                                <p className="employeeDOB">{new Date(specialEmp[index].DOB).toLocaleDateString("es-CL")}</p>
                                                {/* <button id="BirthPerson" onClick={BirthPerson(index)}>view</button> */}
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                        <div id="employeeCount" onClick={Show_details}>
                            <h2>Number of employee's</h2>
                            <div id="countContainer">
                                <h3 id="count">{userData.length}</h3>
                                {/* <div id="arrowIcon">&#9658;</div> */}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div >
        </>
    )
};

export default Dashboard