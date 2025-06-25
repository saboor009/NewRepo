import React from 'react'
import "./Dashboardtwo.css";
import calender from '../icons/cal.png';
import redgraph from '../icons/redgraph.png';
import purplegraph from '../icons/purplegraph.png';
import paitent from '../icons/paitent.png';
// import calender from '../icons/Cal.png'

const Dashboardtwo = () => {
    return (
        <>
        <header>Dashboard</header>
            <div className="dashupper">

                <div className="cards">
                    <div className="cardupper">
                        <div className='icon'><img src={calender} alt="" /></div>
                        <div className='heading'>Total Appointments</div>
                    </div>
                    <div className="cardlower">
                        <div className='details'><h1>60</h1><p>Appointments</p></div>
                        <div className='Graph'><img src={purplegraph} alt="" /></div>
                    </div>
                </div>
                <div className="cards">
                    <div className="cardupper">
                        <div className='icon'><img src={paitent} alt="" /></div>
                        <div className='heading'>Total Appointments</div>
                    </div>
                    <div className="cardlower">
                        <div className='details'><h1>60</h1><p>Appointments</p></div>
                        <div className='Graph'><img src={redgraph} alt="" /></div>
                    </div>
                </div>

            </div>

            <div className="dashlower">
                <div className='seperator'></div>
               
                <div className='docintro'>
                    <div className='docimg'></div>

                    <div>
                        <h3>Doctor Name</h3>
                        <p>Specielization</p>
                    </div>
                    
                    </div>

                    <div className="tags">
                        <div className='tagblock'>
                        <div className="tagg">
                            <p>Gender</p>
                            <h3>Male</h3>
                        </div>
                        <div className="tagg">
                            <p>Age</p>
                            <h3>44</h3>
                        </div>
                        </div>
                        <div className='tagblock'>
                        <div className="tagg">
                            <p>Address</p>
                            <h3>LDA Edan C Block 33c</h3>
                        </div>
                        <div className="tagg">
                            <p>Documents</p>
                            <h3>See More</h3>
                        </div>
                        </div>
                    </div>
                    
                
            </div>

            <div className="form-container">
      <form className="custom-form">
        <label>
          Name
          <input type="text" placeholder="Enter name" />
        </label>

        <label>
          Age
          <input type="number" placeholder="Enter age" />
        </label>

        <label>
          Gender
          <select>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Specialization
          <input type="text" placeholder="Enter specialization" />
        </label>

        <label>
          Address
          <textarea placeholder="Enter address"></textarea>
        </label>

        <label>
          Upload Profile Picture
          <input type="file" accept="image/*" />
        </label>

        <label>
          Upload Certification (PDF)
          <input type="file" accept="application/pdf" />
        </label>

        <button type="submit">Submit</button>
      </form>
    </div>
        </>
    )
}

export default Dashboardtwo
