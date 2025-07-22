import * as React from "react";
import "./Loader.css"
const Loader = () => {
    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh"

        }}>

            <span className="loader"></span>
        </div>

    )
}
export default Loader;
