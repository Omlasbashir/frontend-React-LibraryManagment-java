import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import api from "../services/api";

export const useLoginLogic = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  const handleLogin = async (formData) => {

    try {

      setLoading(true);


      const response = await api.post("/User/login", {
        email: formData.email,
        password: formData.password
      });


      const data = response.data;


      if(data.status){

        const user = data.data;


        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );


        localStorage.setItem(
          "role",
          user.role
        );


        toast.success(
          `Welcome ${user.fullName}`
        );


        navigate("/dashboard");


      }else{

        toast.error(
          "Invalid Email or Password"
        );

      }


    } catch(error){

      toast.error(
        error?.response?.data?.message ||
        "Invalid Email or Password"
      );


    } finally {

      setLoading(false);

    }

  };


  const forgotPassword = () => {

    toast(
      "Please contact Administrator to reset password",
      {
        icon:"🔒"
      }
    );

  };


  return {

    register,
    handleSubmit,
    errors,
    loading,
    showPassword,
    setShowPassword,
    handleLogin,
    forgotPassword

  };

};