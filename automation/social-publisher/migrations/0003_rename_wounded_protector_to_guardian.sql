UPDATE content_items
SET archetype = 'The Guardian',
    updated_at = CURRENT_TIMESTAMP
WHERE archetype IN ('The Wounded Protector', 'Wounded Protector', 'Guardian');
