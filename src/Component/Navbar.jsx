import React, { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { IoIosLogOut } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaUserLock } from "react-icons/fa";
import { auth } from "../utils/firebase";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addAccount, logoutUser } from "../utils/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdDarkMode } from "react-icons/md";
import { CiLight } from "react-icons/ci";
import { addDarkMode } from "../utils/appModeSlice";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const toggle = useSelector((store) => store.appMode.toggle);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const { uid, email, displayName, Employee, AdminContact, Teacher } =
          auth.currentUser;
        dispatch(
          addAccount({
            uid: uid,
            email: email,
            displayName: displayName,
            employee: Employee,
            phone: AdminContact,
            role: Teacher,
          })
        );
        navigate("/mainPage");
      } else {
        dispatch(logoutUser());
        toast.success("logged out");
        navigate("/");
      }
    });

    // Unsubscribe the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        // An error happened.
      });
  };
  return (
    <>
      <ToastContainer />
      <nav className="bg-[#0B3142] text-white w-[20rem] h-full px-2 py-5">
        <div className="px-5 text-center ">
          <Link to={"/mainPage"}>
            <FaUserLock className="text-6xl w-[50%]  mx-auto  " />
            <h1 className="mt-3 font-bold font-poppins">
              {user === null ? `Hello` : `${user.displayName}`}{" "}
            </h1>
          </Link>
        </div>
        <ul className="text-lg px-5 mt-5 ">
          <Link to={"/mainPage/adminProfile"}>
            <li className="flex items-center space-x-2 cursor-pointer">
              <span>
                <FaRegUser className="text-2xl " />
              </span>
              <p
                className=" font-poppins font-bold
             "
              >
                Admin Profile
              </p>
            </li>
          </Link>
          <Link to={"/mainPage/Students"}>
            <li className="flex items-center space-x-2 mt-4 cursor-pointer">
              <span>
                <FaUserFriends className="text-2xl" />
              </span>
              <p className="font-bold font-poppins">MCA</p>
            </li>
          </Link>
          <li className="flex items-center space-x-2 mt-4 cursor-pointer">
            <span>
              {!toggle ? (
                <MdDarkMode
                  onClick={() => dispatch(addDarkMode(true))}
                  className="text-2xl"
                />
              ) : (
                <CiLight
                  onClick={() => dispatch(addDarkMode(false))}
                  className="text-2xl"
                />
              )}
            </span>
            <p className="font-bold font-poppins">
              {!toggle ? "Dark Mode" : "Light Mode"}
            </p>
          </li>
          <li
            onClick={handleSignOut}
            className="flex items-center space-x-2 mt-4 cursor-pointer "
          >
            <span>
              <IoIosLogOut className="text-2xl" />
            </span>
            <p className="font-poppins font-bold ">Logout</p>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;