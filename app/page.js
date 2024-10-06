import AppLogo from "./components/AppLogo";
import Dropzone from "./components/dropzone";

export default function Home() {
  return (
   <div className="page-container">
      <header>
         <AppLogo/>
      </header>
      <section className="pt-2 pb-4">
        <p className="pt-2 pb-6">This free online tool converts your JPG images to PNG format, applying proper compression methods. Unlike other services, this tool does not ask for your email address, offers mass conversion and allows files up to 50 MB.</p>
        <ul className="grid grid-rows-2 gap-4">
          <li className="grid grid-cols-[10px_1fr] gap-2">
             <span className="font-bold">1</span>
             <div className="pl-4 border-l-2">
                <p>Click the UPLOAD FILES button and select up to 20 .jpg images you wish to convert. You can also drag files to the drop area to start uploading.</p>
             </div>
          </li>
          <li className="grid grid-cols-[10px_1fr] gap-2">
             <span className="font-bold">2</span>
             <div className="pl-4 border-l-2">
                <p>Click the UPLOAD FILES button and select up to 20 .jpg images you wish to convert. You can also drag files to the drop area to start uploading.</p>
             </div>
          </li>
        </ul>
      </section>
      <Dropzone/>
   </div>
  );
}
