export default function Page() {
  return (
    <main className="max-w-xl mx-auto p-6 font-plex-mono">
      <h1 className="font-workbench text-lg uppercase">
        Space Marines Army Cost
      </h1>

      <p className="mt-4 text-sm leading-relaxed">
        Building a Space Marines army in Warhammer 40K can vary widely in price
        depending on the list size and units chosen. A typical 2000-point army
        often requires between 40 and 80 models, which can translate to several
        hundred pounds in miniatures.
      </p>

      <p className="mt-3 text-sm leading-relaxed">
        Our Warhammer 40K army cost calculator helps estimate the real-world
        price of building a Space Marines army before buying models. You can
        quickly experiment with different unit combinations and see how the
        total points and box costs change.
      </p>

      <a href="/" className="inline-block mt-6 underline text-sm">
        Open the 40K Army Cost Calculator
      </a>
    </main>
  );
}

