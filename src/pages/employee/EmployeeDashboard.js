import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import Calendar from 'react-calendar';
import HeaderUser from "../../components/User/Header";
import FooterUser from "../../components/User/Footer";

function Employee_Dashboard() {
    const navigate = useNavigate();
    const ref_show = useRef(null);
    const ref_show_close2 = useRef(null);
    const ref_absentees_close3 = useRef(null);
    const ref_calendar = useRef(null);
    const ref_absentees = useRef(null);
    const ref_dashboard = useRef(null);
    const [date, setDate] = useState(new Date());
    const [userData, setUserData] = useState("");
    const [empid, setEmpid] = useState("");
    const [specialEmp, SetSpecialEmp] = useState("");
    const [userData_absentees, setUserData_absentees] = useState("");
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
        Axios.post(`http://localhost:3000/dashboard/`, {
            empid: empid,
        }).then((response => {
            if (response.status === 200) {
                setUserData(response.data);
            } else {
                // Disconnect();
            }
        })).catch(handleAxiosError);
    }, []);

    useEffect(() => {
        // setspecialYear(year.toString().substring(11, 15));
        Axios.post(`http://localhost:3000/birth_date/`, {
            headers: {
                'Content-Type': 'application/json'
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
        })).catch(handleAxiosError);       
    }, [])

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    return (
        <>
            <div id="full_frame">
                <HeaderUser />
                <div ref={ref_show} className="modal">
                    <div className="modal-content">
                        <span ref={ref_show_close2} className="closer">&times;</span>
                        <div id="showing">
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
                        <div id="showing">
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
                                                    <td>{userData_absentees[index].mode}</td>
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
                            <Calendar ref={ref_calendar} onChange={setDate}
                                maxDate={new Date()}
                                minDate={new Date(1990, 1, 1)}
                                value={date}
                            />
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
                    </div>
                </div>
                <FooterUser />
            </div>
        </>
    )
};

export default Employee_Dashboard