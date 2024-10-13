import AppLogo from "./components/AppLogo";
import Dropzone from "./components/dropzone";

export default function Home() {
  return (
   <div>
      <section className="pt-2 pb-4">
        <p className="pt-2 pb-6">Create a single, secure link to access multiple files in seconds! Add expiration dates and password protection for ultimate control.</p>
        <ul className="grid grid-rows-2 gap-4">
          <li className="grid grid-cols-[10px_1fr] gap-2">
             <span className="font-bold">1.</span>
             <div className="pl-4 border-l-2">
             <p>Drop or upload your files below and hit proceed! We support images (JPG, PNG, GIF, WEBP), documents (PDF, Word, Excel, PowerPoint), audio (MP3, OGG, WAV), videos (MP4).</p>
             </div>
          </li>
          <li className="grid grid-cols-[10px_1fr] gap-2">
             <span className="font-bold">2.</span>
             <div className="pl-4 border-l-2">
             <p>Choose an expiry time or select "Never" for permanent access. Optionally, enable password protection by entering a secure password, then hit "Create" to generate your link!</p>
             </div>
          </li>
        </ul>
      </section>
      <Dropzone/>
   </div>
  );
}
