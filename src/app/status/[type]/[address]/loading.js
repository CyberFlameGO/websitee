export default function Loading() {
    return (
        <section aria-busy="true" aria-live="assertive" aria-atomic="true">
            <div className="flex gap-3 py-4 mt-5 card">
                <div className="w-1/4">
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700 opacity-70" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700 opacity-70" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="block w-full h-12 rounded bg-neutral-300 dark:bg-neutral-700" />
                </div>
                <div className="w-3/4">
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700 opacity-70" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700 opacity-70" />
                    <div className="block w-full h-12 mb-3 rounded bg-neutral-300 dark:bg-neutral-700" />
                    <div className="block w-full h-12 rounded bg-neutral-300 dark:bg-neutral-700" />
                </div>
            </div>
        </section>
    );
}