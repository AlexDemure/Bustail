import os
from datetime import datetime

from backend.submodules.object_storage.uploader import ObjectStorage

object_storage = ObjectStorage(
    "vjKT4bkvLmWQQhkdxkJ9",
    "nw5RGWdC3qkYSEedFvrDvS3yCPTxu46oGkHgPUyA",
    "bustail"
)


class BackupDB:

    dirname = "backups"
    psql_db = "bustail"
    psql_user = container_name = 'postgres'

    dump_name = None

    def checkdir(self):
        exists = os.path.exists(f'./{self.dirname}')
        if not exists:
            os.mkdir(f'./{self.dirname}')

    def dump(self):
        self.checkdir()

        self.dump_name = f"{datetime.utcnow().strftime('%Y-%m-%d__%H-%M-%S')}.sql"

        dump_db_operation_status = os.WEXITSTATUS(os.system(
            f"docker exec -i postgres pg_dump --username postgres bustail > ./{self.dirname}/{self.dump_name}"
        ))
        if dump_db_operation_status != 0:
            exit(f"Dump database command exits with status {dump_db_operation_status}")

        self.upload()
        print("Dump is uploaded")

    def upload(self):
        with open(f"./{self.dirname}/{self.dump_name}", 'rb') as file:
            object_storage.upload(
                file_content=file.read(),
                content_type="application/sql",
                file_url=f"{self.dirname}/{self.dump_name}"
            )


if __name__ == '__main__':
    BackupDB().dump()
