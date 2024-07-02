import React from 'react'

const MyProfile = () =>{
    const LoginInfo = JSON.parse(localStorage.userInfo)
    const [file1, setFile1] = useState()
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState()

    const onChangeFile1 = (e) => {
        setFile1({ file1: e.target.files });
      };

      setEmail(LoginInfo.email)
      const  onSubmit = async(e) => {
        e.preventDefault();
    
        const data = {
          file1: file1,
          email: email
               
        };
        console.log(data);
        fetch('http://localhost:5000/resume', {
          method: 'POST',
          headers:{
            'Accept': 'application/json',
            'Content-type': 'application/json'
          },
         body:JSON.stringify(data)
        }).then((res) => {
              console.log(res.data);
              setMessage("File Uploaded Successfully");			
            })
            .catch((error) => {
              console.log(error);
            });
  }

    return(
        <>
        { 
        ()=>{
            if(LoginInfo){
                return(
                    <>
                    <form className="form-control" onSubmit={onSubmit}>
                    <div>My Profile</div>
                    <div class="mb-3">
                        <label for="formFile" class="form-label">Upload your Resume to see Matching Jobs and your Skill Score</label>
                        <input class="form-control" type="file" id="formFile" onChange={onChangeFile1}/>
                    </div>
                    <button type="submit" class="btn btn-primary">Submit</button>
                    <div className="message form-group">{message ? <p>{message}</p> : null}</div>
                    </form>
                    </>
                )
            }else{
                <>
                <div>Please Login First to see your profile </div>
                </>
            }
        }
        }
        </>
    )
}
export default MyProfile