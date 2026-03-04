import argparse
import subprocess
import journal.database

def start(_args):
    subprocess.run(["uv","run","python3",
                    "-m","uvicorn","journal.app:app",
                    "--host","0.0.0.0",
                    "--reload"])

def init_db(_args):
    print("initialising database")
    journal.database.init_db("journal/schema.sql")
    print("database initialed")

def main():
    parser = argparse.ArgumentParser(
        prog='run.py',
        description='Runs/configures the backend server')

    subparsers = parser.add_subparsers(dest="command", required=True)

    start_parser = subparsers.add_parser("start", help="Start the FastAPI server.")
    start_parser.set_defaults(func=start)

    init_parser = subparsers.add_parser("init-db", help="Initialize the database")
    init_parser.set_defaults(func=init_db)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()