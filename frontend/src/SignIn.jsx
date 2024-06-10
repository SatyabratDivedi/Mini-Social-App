import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {toast} from "react-hot-toast";

const SignIn = () => {
  const navigate = useNavigate(); 
  const userData = {
    email: "",
    password: "",
  };

  const [edit, setEdit] = useState(userData);

  const editHandle = e => {
    setEdit({...edit, [e.target.name]: e.target.value});
  };

  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/api/sign-in", {
      method: "POST",
      body: JSON.stringify(edit),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      navigate('/posts');
      console.log(response)
      toast.success("Successfully created!");
      setEdit(userData);
    } else {
      toast.error("Something went wrong!");
    }
  };
  const submitHandle = async e => {
    e.preventDefault();
    fetchData();
  };
  return (
    <>
      <div className=" h-screen w-screen  flex justify-center items-center text-white">
        <form onSubmit={submitHandle} action="" className="flex flex-col gap-3 text-black">
          <div>
            <Link to="/" className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded ">
              Back
            </Link>
            <span className="font-bold text-white">SignIn</span>
          </div>
          <input name="email" value={edit.email} onChange={editHandle} type="email" placeholder="Email" />
          <input name="password" value={edit.password} onChange={editHandle} type="password" placeholder="Password" />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded">SignIn</button>
          <Link to={"/signup"} className=" text-blue-400 border-b-2 border-blue-400 hover:text-blue-500">
            not have an account
          </Link>
        </form>
      </div>
    </>
  );
};
export default SignIn;
