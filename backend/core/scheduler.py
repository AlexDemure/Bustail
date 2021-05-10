from apscheduler.schedulers.asyncio import AsyncIOScheduler

from backend.apps.applications.tasks import completed_applications, in_progress_applications


def start():
    scheduler = AsyncIOScheduler(timezone='Europe/Moscow')
    scheduler.add_job(in_progress_applications, 'cron', hour=6)
    scheduler.add_job(completed_applications, 'cron', hour=8)
    scheduler.start()
