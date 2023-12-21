import { type ProblemType } from "@hidden-identity/shared";
import { Callout } from "@radix-ui/themes";
import { BiFastForward, BiSolidHide } from "react-icons/bi";
import { GiAngularSpider, GiCrossMark } from "react-icons/gi";

interface ProblemExplanationProps {
  explanation: React.ReactNode;
  children: React.ReactNode;
}
function ProblemExplanation(props: ProblemExplanationProps) {
  return (
    <Callout.Root className="mt-3">
      <Callout.Icon>{props.children}</Callout.Icon>
      <Callout.Text>{props.explanation}</Callout.Text>
    </Callout.Root>
  );
}

export function SeatingProblem({ problem }: { problem: ProblemType }) {
  switch (problem) {
    case "excluded": {
      return (
        <ProblemExplanation explanation="Likely the player to your left skipped you, make sure they know you're their neighbor!">
          <BiSolidHide />
        </ProblemExplanation>
      );
    }
    case "excluder": {
      return (
        <ProblemExplanation explanation="It looks like you might have picked the wrong person to your right, maybe check their name and reselect below?">
          <BiFastForward />
        </ProblemExplanation>
      );
    }
    case "spiderman": {
      return (
        <ProblemExplanation explanation="You are pointing at the person pointing at you!  Consult with the person on your right and see who's the real spiderman">
          <GiAngularSpider />
        </ProblemExplanation>
      );
    }
    case "broken-link": {
      return (
        <ProblemExplanation explanation="The player on your right may have left the game, please reselect the player on your right.">
          <GiCrossMark />
        </ProblemExplanation>
      );
    }

    default:
      return "oops";
  }
}
