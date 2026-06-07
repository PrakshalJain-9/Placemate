import { Link } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";

export default function NotFound() {
    return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gray-50" style={{ backgroundColor: 'var(--color-background)' }}>
            <Card className="text-center !max-w-md">
                <h1 className="font-bold text-4xl mb-4" style={{ color: 'var(--color-primary)' }}>404</h1>
                <h2 className="font-semibold text-xl mb-2">Page Not Found</h2>
                <p className="text-muted mb-6">
                    Oops! The page you are looking for does not exist or you don't have permission to view it.
                </p>
                <div className="flex justify-center">
                    <Link to="/">
                        <Button>Return to Home</Button>
                    </Link>
                </div>
            </Card>
        </div>
    );
}
