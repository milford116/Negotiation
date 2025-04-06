import { Button} from "./components/Button";


export function MyConsent({ next }) {
  return (
    <div>
      <div>Do you consent?</div>
      <div>
        <Button type="button" handleClick={next}>
          Yes!
        </Button>
      </div>
    </div>
  );
}