# from apscheduler.schedulers.asyncio import AsyncIOScheduler
#
# from apps.projects.logic import upload_rss_everyday
# from utils.overrides import get_actual_timezone
#
#
# def start():
#     sched = AsyncIOScheduler(timezone=get_actual_timezone())
#     sched.add_job(upload_rss_everyday, 'cron', hour=10)
#     sched.start()
