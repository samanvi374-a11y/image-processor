import { useEffect, useState } from "react";
import "./App.css";

function App() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");


  useEffect(() => {

    if (!jobId) return;

    const timer = setInterval(async () => {

      try {

        const res = await fetch(
          `http://localhost:5000/api/images/status/${jobId}`
        );

        const data = await res.json();


        if (data?.image) {

          setResult(data.image);


          if (
            ["completed", "failed"].includes(data.image.status)
          ) {

            clearInterval(timer);
            setLoading(false);

          }

        }


      } catch(err) {

        console.error(err);

      }

    },2000);


    return () => clearInterval(timer);


  },[jobId]);




  const handleImage = (e) => {

    const file = e.target.files[0];

    if(!file) return;


    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");

  };





  const handleUpload = async()=>{


    if(!image){

      setError("Please select an image first.");
      return;

    }


    const formData = new FormData();

    formData.append("image",image);



    try{

      setLoading(true);
      setError("");
      setResult(null);


      const res = await fetch(
        "http://localhost:5000/api/images/upload",
        {
          method:"POST",
          body:formData
        }
      );


      const data = await res.json();


      if(!res.ok)
        throw new Error(
          data.message || "Upload failed"
        );


      setJobId(data.imageId);


    }
    catch(err){

      console.error(err);

      setLoading(false);

      setError(
        err.message || "Upload failed"
      );

    }


  };





  const metricCards = result
  ?[


    {
      label:"Status",
      value:result.status || "Pending"
    },



    {
      label:"Duplicate Detection",
      value:
      result.isDuplicate
      ?
      "Duplicate Image"
      :
      "Original Image"
    },



    {
      label:"Image Quality",
      value:
      <>
      <p>
      Brightness Score : {result.brightnessScore || 0}
      </p>

      <p>
      Brightness Status : {result.brightnessStatus || "-"}
      </p>


      <br/>


      <p>
      Blur Score : {result.blurScore || 0}
      </p>


      <p>
      Blur Status : {result.blurStatus || "-"}
      </p>

      </>
    },



    {
      label:"Dimensions",
      value:
      result.imageWidth &&
      result.imageHeight
      ?
      `${result.imageWidth} × ${result.imageHeight}`
      :
      "-"
    },



    {
      label:"OCR Text",
      value:
      result.extractedText || "Not Found"
    },


    {
      label:"Plate Number",
      value:
      result.plateNumber || "Not Detected"
    },


    {
      label:"Plate Valid",
      value:
      result.plateValid
      ?
      "Yes"
      :
      "No"
    },


    {
      label:"Reason & Possible Causes",
      value:
      <>
      
      <p>
      {result.plateDetectionReason || "-"}
      </p>


      {
        result.possibleCauses &&
        result.possibleCauses.length > 0 &&

        <>

        <br/>

        <p>
        Possible Causes:
        </p>


        {
          result.possibleCauses.map(
            (cause,index)=>(

              <p key={index}>
              {cause}
              </p>

            )
          )
        }

        </>

      }


      </>
    },
        {
      label:"Metadata",
      value:
      <>
      <p>
      Camera : {result.camera || "-"}
      </p>

      <p>
      Model : {result.cameraModel || "-"}
      </p>


      <p>
      Software : {result.software || "-"}
      </p>


      <p>
      Captured Date : {result.capturedDate || "-"}
      </p>


      <p>
      Status : {result.metadataStatus || "-"}
      </p>

      </>
    },


    {
      label:"Processing Time",
      value:
      result.processingTime
      ?
      `${result.processingTime} ms`
      :
      "-"
    },


    {
      label:"Error",
      value:
      result.errorMessage || "-"
    }


  ]
  :
  [];





return (

<div className="app-shell">


<div className="hero-card">


<div className="hero-heading">


<p className="eyebrow">
GoGig Media Processor
</p>


<h1>
Upload an image and review the full OCR analysis.
</h1>


<p className="subtext">
This view shows the complete image processing pipeline.
</p>


</div>





<div className="upload-card">


<input
type="file"
accept="image/*"
onChange={handleImage}
/>




{
preview &&

<img
src={preview}
alt="preview"
className="preview"
/>

}





<button
onClick={handleUpload}
disabled={loading}
>

{
loading
?
"Processing..."
:
"Proceed"
}

</button>





{
error &&

<p className="error-text">
{error}
</p>

}



</div>


</div>








{
result &&


<div className="result-card">


<div className="result-header">


<h2>
Processing Result
</h2>



<span
className={`pill ${
result.status==="completed"
?
"success"
:
result.status==="failed"
?
"danger"
:
"neutral"
}`}
>

{result.status || "Pending"}

</span>


</div>







<div className="stats-grid">


{
metricCards.map((item)=>(


<div
className="stat-box"
key={item.label}
>


<div className="label">
{item.label}
</div>



<div className="value">
{item.value}
</div>



</div>


))
}



</div>




</div>


}



</div>


);

}


export default App;