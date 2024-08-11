import { useState, useEffect } from "react";
import { json, useLoaderData, useActionData, Form } from "@remix-run/react";
import { LoaderFunction, ActionFunction } from "@remix-run/node";
import { classifyQuery } from "~/utils/classifyQuery";

type LoaderData = {
  query?: string;
  result?: string;
};

type ActionData = 
  | { query: string; result: string }
  | { error: string };

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const query = formData.get("query") as string;
  try {
    const result = classifyQuery(query);
    return json<ActionData>({ query, result });
  } catch (error) {
    return json<ActionData>({ error: "Failed to classify query" }, { status: 500 });
  }
};

export default function Index() {
  const loaderData = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const [query, setQuery] = useState(loaderData.query || "");
  const [result, setResult] = useState(loaderData.result || "");

  useEffect(() => {
    if (actionData && 'query' in actionData) {
      setQuery(actionData.query);
      setResult(actionData.result);
    }
  }, [actionData]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold text-center">Query Classifier</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <Form method="post" className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="relative">
                  <input
                    type="text"
                    name="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:border-rose-600"
                    placeholder="Enter your query"
                  />
                  <label className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                    Enter your query
                  </label>
                </div>
                <div className="relative">
                  <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50">
                    Classify
                  </button>
                </div>
              </Form>
              {actionData && 'error' in actionData && (
                <div className="text-red-500 text-sm mt-2">{actionData.error}</div>
              )}
              {result && (
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <h2 className="text-xl font-semibold">Result:</h2>
                  <p><span className="font-medium">Query:</span> {query}</p>
                  <p><span className="font-medium">Classification:</span> {result}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}