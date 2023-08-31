import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"
import moment from "moment";
import Axios from 'axios';
import { useEffect } from 'react';
import { Accordion } from 'react-bootstrap';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import HeaderUser from "../../components/User/Header";
import FooterUser from "../../components/User/Footer"

function ShowAttendance_emp() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [name, setName] = useState("");
    const [dateFrom, setDateFrom] = useState(new Date().toISOString().substr(0, 8) + "01");
    const [dateTo, setDateTo] = useState(new Date().toISOString().substr(0, 10));
    const [mode, setMode] = useState("");
    const [status, setStatus] = useState("");
    const [empid, setEmpid] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const ref_dashboard = useRef(null);
    const acc_option = useRef(null);
    const acc_selector = useRef(null);
    const [isDataVisible, setDataVisible] = useState(false);
    const errors = {
        CONFIRM_PASSWORD: "ENTER CORRECT CONFIRM PASSWORD!",
        NEW_PASSWORD: "ENTER NEW PASSWORD!",
        CURRENT_PASSWORD: "ENTER CURRENT PASSWORD!",
        NEW_PASSWORD_LENGTH: "ENTER THE VALID USERNAME AND MINIMUM 8 CHARACTER INCLUDE NUMNBER AND SPECIAL CHAR(*,&,...)",
        NULL: "",
        input: "EMPTY",
        null: ""
    };


    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );

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
        if (!localStorage.getItem("token")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    function search() {
        if (dateFrom == "" || dateTo == "") {
            setErrorMessages({ name: "name", message: errors.input });
        } else {
            if (mode) {
                Axios.post('http://localhost:3000/show-all-attendance/', {
                    empid: empid,
                    empname: name,
                    mode: mode,
                    status: status,
                    datefrom: dateFrom,
                    dateto: dateTo,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    setUserData(response.data);
                    let Accordion = acc_option.current;
                    Accordion.style.display = "block";
                    setErrorMessages({ name: "null", message: errors.null });
                }).catch(handleAxiosError)
            } else {
                Axios.post('http://localhost:3000/show-all-attendance/', {
                    empid: empid,
                    empname: name,
                    status: status,
                    datefrom: dateFrom,
                    dateto: dateTo,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response) => {
                    setUserData(response.data);
                    let Accordion = acc_option.current;
                    Accordion.style.display = "block";
                    setErrorMessages({ name: "null", message: errors.null });
                }).catch(handleAxiosError)
            }
        }
    }

    function clear() {
        setDateFrom("");
        setDateTo("");
        setErrorMessages({ name: "null", message: errors.null });
    }

    useEffect(() => {
        Axios.post('http://localhost:3000/my_info/', {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            const data = response.data[0];
            setEmpid(data.EmpID);
            setName(data.First_Name + " " + data.Last_Name);
            Axios.post('http://localhost:3000/show-all-attendance/', {
                empid: response.data[0].EmpID,
                empname: data.First_Name + " " + data.Last_Name,
                mode: mode,
                datefrom: dateFrom,
                dateto: dateTo,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                setUserData(response.data);
                let Accordion = acc_option.current;
                Accordion.style.display = "block";
                setErrorMessages({ name: "null", message: errors.null });
            }).catch(handleAxiosError)
        })).catch(handleAxiosError)
    }, []);

    function handleDelete(modeData) {
        Axios.post('http://localhost:3000/delete_record/', {
            empid: empid,
            empname: name,
            date: moment(modeData[0].Date).format("YYYY-MM-DD"),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            search();
        }).catch(handleAxiosError)
    };


    const handleModeSelection = () => {
        setDataVisible(!isDataVisible);
    };

    const renderModeAccordion = (modeKey, modeName, modeData) => {

        return (
            <Accordion.Item ref={acc_selector} key={modeKey} eventKey={modeKey}>
                <Accordion.Header onClick={() => handleModeSelection(modeKey)}>{modeName}
                    <span className="accordion-icon"> {isDataVisible ? <FaChevronUp /> : <FaChevronDown />}</span>
                </Accordion.Header>
                <Accordion.Body>
                    <div id="showing">
                        <table>
                            <tbody>
                                <tr>
                                    <th>EMPID</th>
                                    <th>EMPLOYEE NAME</th>
                                    <th>DESIGNATION</th>
                                    <th>DATE</th>
                                    <th>Status</th>
                                </tr>
                            </tbody>
                            <tbody>
                                {modeData.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.EmpID}</td>
                                        <td>{item.EmpName}</td>
                                        <td>{item.Designation}</td>
                                        <td>{new Date(item.Date).toLocaleDateString("es-CL")}</td>
                                        <td>{item.Status}{" "}
                                            {item.Status === "Pending" && (
                                                <button className="btn-three" onClick={() => handleDelete(modeData)}>DELETE</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        );
    };

    return (
        <>
            <div id="full_frame">
                <HeaderUser />
                <div ref={ref_dashboard} id="body">
                    <center><h2 id="attendance_h2">Show Attendance</h2></center>
                    <div id="searching">
                        <div id="together_one">
                            <label htmlFor="empid">Emp ID</label>
                            <input id="empNo" type="number" disabled placeholder="1234" name="userName" onChange={(e) => setEmpid(e.target.value)} value={empid}></input>
                            <label htmlFor="name">Employee name</label>
                            <input id="empName" type="text" disabled placeholder="Name" name="name" onChange={(e) => setName(e.target.value)} value={(name)}></input>
                        </div>
                        <div id="together">
                            <label htmlFor="date">From</label>
                            <input id="dateFrom" type="date" onChange={(e) => setDateFrom(e.target.value)} value={dateFrom} name="date"></input>
                            {renderErrorMessage("name")}
                            <label htmlFor="date">To</label>
                            <input id="dateTo" type="date" onChange={(e) => setDateTo(e.target.value)} value={dateTo} name="date"></input>
                            {renderErrorMessage("name")}
                        </div>
                        <label htmlFor="mode">Attendance type</label>
                        <select id="empMode" onChange={(e) => setMode(e.target.value)} value={mode}>
                            <option value="">ALL</option>
                            <option value="1">WFH</option>
                            <option value="2">WFO</option>
                            <option value="3">HYBRID</option>
                            <option value="4">LEAVE</option>
                        </select>
                        <label htmlFor="status">Status type</label>
                        <select id="empMode" onChange={(e) => setStatus(e.target.value)} value={status}>
                            <option value="">ALL</option>
                            <option value="Accept">ACCEPT</option>
                            <option value="Pending">PENDING</option>
                        </select>
                    </div>
                    <div id="buttons">
                        <button id="search_buttom1" type="submit" value="search" onClick={(search)}>SEARCH</button>
                        <button id="search_buttom2" type="reset" value="cancel" onClick={(clear)}>CANCEL</button>
                    </div>
                    <Accordion ref={acc_option} defaultActiveKey="1" alwaysOpen>
                        {[
                            { key: "1", name: "WFH" },
                            { key: "2", name: "WFO" },
                            { key: "3", name: "HYBRID" },
                            { key: "4", name: "LEAVE" }
                        ].map((mode) => {
                            const modeData = userData.filter((item) => item.mode == mode.key);
                            if (modeData.length > 0) {
                                return renderModeAccordion(mode.key, mode.name, modeData);
                            }
                            return null;
                        })}
                    </Accordion>
                </div>
                <FooterUser />
            </div >
        </>
    )
};

export default ShowAttendance_emp
