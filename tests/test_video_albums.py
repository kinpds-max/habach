import importlib.util
import json
import unittest
from pathlib import Path

spec = importlib.util.spec_from_file_location('sync', Path(__file__).parents[1] / 'scripts/sync_video_albums.py')
sync = importlib.util.module_from_spec(spec)
spec.loader.exec_module(sync)

class AlbumTests(unittest.TestCase):
    def setUp(self):
        self.source = (sync.ROOT / 'index.html').read_text()
        self.views = json.loads(sync.VIEWS.search(self.source)[2])

    def test_preserves_other_views_and_static_only_cards(self):
        post = {'section_key': 'sermon-8', 'youtube_id': 'Abcdef12345', 'title': '새벽예배 2026.10.28 <script>alert(1)</script>', 'published_at': '2026-10-29T00:00:00Z'}
        result, report = sync.synchronize(self.source, [post, post])
        views = json.loads(sync.VIEWS.search(result)[2])
        self.assertIn('&lt;script&gt;', views['sermon-8'])
        self.assertEqual(views['sermon-8'].count('data-video="Abcdef12345"'), 1)
        for key, value in self.views.items():
            if key not in ('sermon-8', 'index'):
                self.assertEqual(value, views[key], key)
        old_ids = {m[1] for m in sync.CARD.finditer(self.views['sermon-8'])}
        self.assertTrue(old_ids <= {m[1] for m in sync.CARD.finditer(views['sermon-8'])})
        self.assertIn('2026-10-28', views['sermon-8'])
        self.assertEqual(sync.synchronize(result, [post, post])[0], result)

    def test_same_day_uses_actual_publish_time(self):
        posts = [
            {'section_key': 'sermon-4', 'youtube_id': 'Zbcdef12345', 'title': 'Earlier prayer', 'published_at': '2026-08-29T02:00:00Z'},
            {'section_key': 'sermon-4', 'youtube_id': 'Abcdef12345', 'title': 'Later choir', 'published_at': '2026-08-29T03:00:00Z'},
        ]
        result, _ = sync.synchronize(self.source, posts)
        views = json.loads(sync.VIEWS.search(result)[2])
        self.assertLess(views['sermon-4'].index('data-video="Abcdef12345"'), views['sermon-4'].index('data-video="Zbcdef12345"'))
        home_card = views['index'].split('href="#/sermon-4">')[1].split('</a></div>')[1].split('</a>')[0]
        self.assertIn('data-video="Abcdef12345"', home_card)

    def test_empty_api_does_not_erase_albums(self):
        result, report = sync.synchronize(self.source, [])
        self.assertEqual(json.loads(sync.VIEWS.search(result)[2]), self.views)

    def test_rejects_invalid_video_ids(self):
        with self.assertRaises(ValueError):
            sync.synchronize(self.source, [{'section_key': 'sermon-4', 'youtube_id': '"><script>', 'title': 'bad'}])

if __name__ == '__main__':
    unittest.main()
