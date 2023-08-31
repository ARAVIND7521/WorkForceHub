import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import Axios from 'axios';
import moment from "moment";
import Header from "../../components/Admin/Header";
import Footer from "../../components/Admin/Footer";

function Attendance_status() {
    const navigate = useNavigate();
    const ref_acceptStatus = useRef(null);
    const ref_declineStatus = useRef(null);
    const ref_acceptStatus_close2 = useRef(null);
    const ref_acceptStatus_accept = useRef(null);
    const ref_acceptStatus_wait_accept = useRef(null);
    const ref_declineStatus_decline = useRef(null);
    const ref_declineStatus_wait_decline = useRef(null);
    const ref_declineStatus_close3 = useRef(null);
    const [userData, setUserData] = useState([]);
    const [status, setStatus] = useState("Pending");
    const ref_dashboard = useRef(null);
    const modeMap = {
        1: "Remote",
        2: "In-office",
        3: "Hybird",
        4: "Leave"
    };

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
        if (!localStorage.getItem("secretID")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        Axios.post(`http://localhost:3000/attendance_status/`, {
            status: status
        }).then((response => {
            setUserData(response.data)
        })).catch(handleAxiosError);
    }, []);

    function Accept(dataitems) {
        const modal = ref_acceptStatus.current;
        const btn1 = ref_acceptStatus_accept.current;
        const btn2 = ref_acceptStatus_wait_accept.current;
        const span = ref_acceptStatus_close2.current;
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }

        btn1.onclick = function () {
            const currentMode = dataitems.mode;
            let attendanceStatus;
            if (currentMode < 4) {
                attendanceStatus = "Present";
            } else {
                attendanceStatus = "Absent";
            }
            Axios.post("http://localhost:3000/attendance_status_update/", {
                empid: dataitems.EmpID,
                date: moment(new Date(dataitems.Date)).format("YYYY-MM-DD"),
                status_update: "Accept",
                attendance_status: attendanceStatus
            }).then(response => {
                modal.style.display = "none";
                window.location.reload(false);
            }).catch(handleAxiosError);
        }

        btn2.onclick = function () {
            modal.style.display = "none";

        }
    };

    function Decline(dataitems) {
        const modal = ref_declineStatus.current;
        const btn1 = ref_declineStatus_decline.current;
        const btn2 = ref_declineStatus_wait_decline.current;
        const span = ref_declineStatus_close3.current;
        modal.style.display = "block";
        span.onclick = function () {
            modal.style.display = "none";
        }

        btn1.onclick = function () {
            Axios.post('http://localhost:3000/delete_record/', {
                empid: dataitems.EmpID,
                empname: dataitems.EmpName,
                date: moment(new Date(dataitems.Date)).format("YYYY-MM-DD"),
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                modal.style.display = "none";
                window.location.reload(false);
            }).catch(handleAxiosError)
        }

        btn2.onclick = function () {
            modal.style.display = "none";
        }
        // const modal = ref_declineStatus.current;
        // const btn1 = ref_declineStatus_decline.current;
        // const btn2 = ref_declineStatus_wait_decline.current;
        // const span = ref_declineStatus_close3.current;
        // modal.style.display = "block";
        // span.onclick = function () {
        //     modal.style.display = "none";
        // }

        // btn1.onclick = function () {
        //     const currentMode = dataitems.mode;
        //     let attendanceStatus;
        //     if (currentMode < 4) {
        //         attendanceStatus = "Not-approve";
        //     } else {
        //         attendanceStatus = "Not-approve";
        //     }
        //     Axios.post("http://localhost:3000/attendance_status_update/", {
        //         empid: dataitems.EmpID,
        //         date: moment(new Date(dataitems.Date)).format("YYYY-MM-DD"),
        //         status_update: "Decline",
        //         attendance_status: attendanceStatus
        //     }).then(response => {
        //         modal.style.display = "none";
        //         window.location.reload(false);
        //     }).catch(handleAxiosError);
        // }

        // btn2.onclick = function () {
        //     modal.style.display = "none";
        // }
    }

    return (
        <>
            <div id="full_frame_statuscheck">
                <Header />
                <div ref={ref_acceptStatus} className="modal">
                    <div className="modal-content">
                        <span ref={ref_acceptStatus_close2} className="close">&times;</span>
                        <p>Are you sure to accept this!</p>
                        <button ref={ref_acceptStatus_accept} id="accept" className="button_hide">ACCEPT</button>
                        <button ref={ref_acceptStatus_wait_accept} id="wait_accept" className="button_next">CLOSE</button>
                    </div>
                </div>
                <div ref={ref_declineStatus} className="modal">
                    <div className="modal-content">
                        <span ref={ref_declineStatus_close3} className="close">&times;</span>
                        <p>Are you sure to reject and delete this!</p>
                        <button ref={ref_declineStatus_decline} id="decline" className="button_hide">DECLINE</button>
                        <button ref={ref_declineStatus_wait_decline} id="wait_decline" className="button_next">CLOSE</button>
                    </div>
                </div>
                <div ref={ref_dashboard} id="body">
                    <center><h2 id="attendance_h2">Attendance Status</h2></center>
                    <div id="showing">
                        <table id="statusBar">
                            <tbody>
                                <tr>
                                    <th>EMPID</th>
                                    <th>EMPLOYEE NAME</th>
                                    <th>DESIGNATION</th>
                                    <th>DATE</th>
                                    <th>Status</th>
                                    <th>MODE</th>
                                    <th>PERMISSION</th>
                                </tr>
                            </tbody>
                            <tbody id="dataitems">
                                {
                                    Object.keys(userData).map((item, index) => {
                                        const userItem = userData[index];
                                        return (
                                            <tr key={index}>
                                                <td >{userItem.EmpID}</td>
                                                <td>{userItem.EmpName}</td>
                                                <td>{userItem.Designation}</td>
                                                <td>{new Date(userItem.Date).toLocaleDateString("es-CL")}</td>
                                                <td>{userItem.Status}</td>
                                                <td>{modeMap[userItem.mode]}</td>
                                                <td>
                                                    <button className="button_hide" onClick={() => { Accept(userItem) }}><i className="move_icon fa fa-check"></i></button>
                                                    <button className="button_next" onClick={() => { Decline(userItem) }}><i className="move_icon fa fa-close"></i></button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer />
            </div >
        </>
    )
};

export default Attendance_status