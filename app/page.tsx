import { AudioProvider } from "./components/AudioProvider";
import PortfolioShell from "./components/PortfolioShell";

export default function Page() {
  return (
    <AudioProvider>
      <PortfolioShell />
    </AudioProvider>
  );
}
