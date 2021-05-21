from apscheduler.schedulers.asyncio import AsyncIOScheduler

from backend.apps.applications.tasks import completed_applications, in_progress_applications, expire_applications


def start():
    scheduler = AsyncIOScheduler(timezone='Europe/Moscow')
    scheduler.add_job(in_progress_applications, 'cron', hour=6)
    scheduler.add_job(completed_applications, 'cron', hour=8)
    scheduler.add_job(expire_applications, 'cron', hour=10)
    scheduler.start()
