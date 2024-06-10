import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";

const SingUp = () => {
  const navigate = useNavigate();
  const userData = {
    name: "",
    email: "",
    password: "",
  };
  const [edit, setEdit] = useState(userData);

  const changeHandle = e => {
    setEdit({...edit, [e.target.name]: e.target.value});
  };
  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/api/sign-up", {
      method: "POST",
      body: JSON.stringify(edit),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      setEdit(userData);
      navigate('/signin');
    }
    const data = await response.json();
    return data;
  };
  const submitHandle = e => {
    e.preventDefault();
    toast.promise(fetchData(), {
      loading: "Loading",
      success: (data) => `${data.msg}`,
      error: "Error when fetching",
    });
  };

  return (
    <>
      <div className=" h-screen w-screen  flex flex-col gap-3 justify-center items-center text-white">
        <div>
          <Link to="/" className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ">
            Back
          </Link>
          <span className="font-bold text-white">SignUp</span>
        </div>
        <form onSubmit={submitHandle} method="POST" enctype="multipart/form-data" action="" className="flex flex-col gap-3 text-black">
          <input onChange={changeHandle} value={edit.name} name="name" type="text" placeholder="Name" />
          <input onChange={changeHandle} value={edit.email} name="email" type="email" placeholder="Email" />
          <input onChange={changeHandle} value={edit.password} name="password" type="text" placeholder="Password" />
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">
            SignUp
          </button>
          <Link to={"/signin"} className=" text-blue-400 border-b-2 border-blue-400 hover:text-blue-500">
            Already have an account
          </Link>
        </form>
      </div>
    </>
  );
};
export default SingUp;
