import { Button} from "./components/Button";


export function Exit({ next }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        
        next();
      };
  return (
    <div>
      
      <div>
        {/* <Button type="button" onClick={handleSubmit}>
          Finished! thank you for participating.
        </Button> */}
        <h3>
        Finished! thank you for participating.  
        </h3>
      </div>
    </div>
  );
}