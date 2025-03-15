from fast import SessionLocal, User, Community, EventModel, EVENTS, Base, engine

def seed_database():
    # Create all tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Sample Users
    users = [
        {
            "name": "John Doe",
            "email": "john@example.com",
            "interests": ["technology", "music", "photography"],
            "bio": "Tech enthusiast and amateur photographer"
        },
        {
            "name": "Jane Smith",
            "email": "jane@example.com",
            "interests": ["art", "literature", "culture"],
            "bio": "Artist and book lover"
        },
        {
            "name": "Raj Kumar",
            "email": "raj@example.com",
            "interests": ["sports", "fitness", "health"],
            "bio": "Fitness trainer and sports enthusiast"
        },
        {
            "name": "Priya Sharma",
            "email": "priya@example.com",
            "interests": ["dance", "music", "spirituality"],
            "bio": "Classical dancer and meditation practitioner"
        }
    ]
    
    # Sample Communities
    communities = [
        {
            "name": "Chennai Tech Hub",
            "description": "A community for tech enthusiasts and professionals",
            "category": "Technology",
            "interests": ["technology", "coding", "innovation"]
        },
        {
            "name": "Arts & Culture Circle",
            "description": "Celebrating Chennai's rich cultural heritage",
            "category": "Culture",
            "interests": ["art", "music", "dance", "literature"]
        },
        {
            "name": "Fitness First",
            "description": "Group for fitness enthusiasts and health conscious people",
            "category": "Health",
            "interests": ["fitness", "health", "sports", "yoga"]
        },
        {
            "name": "Creative Minds",
            "description": "Platform for artists and creative professionals",
            "category": "Art",
            "interests": ["art", "photography", "design"]
        },
        {
            "name": "Nature Lovers",
            "description": "Group for environmental awareness and nature activities",
            "category": "Environment",
            "interests": ["nature", "environment", "photography"]
        }
    ]
    
    try:
        # Add events to database
        for event_data in EVENTS:
            # Create EventModel instance
            event = EventModel(
                id=event_data["id"],
                name=event_data["name"],
                location=event_data["location"],
                type=event_data["type"],
                date=event_data["date"],
                time=event_data["time"],
                description=event_data["description"],
                image_url=event_data["image_url"]
            )
            db.add(event)

        # Insert Users
        db_users = []
        for user_data in users:
            user = User(**user_data)
            db.add(user)
            db_users.append(user)
        
        # Insert Communities
        db_communities = []
        for community_data in communities:
            community = Community(**community_data)
            db.add(community)
            db_communities.append(community)
        
        # Create some sample relationships
        db_users[0].communities.extend([db_communities[0], db_communities[3]])  # John joins Tech and Creative
        db_users[1].communities.extend([db_communities[1], db_communities[3]])  # Jane joins Culture and Creative
        db_users[2].communities.extend([db_communities[2]])  # Raj joins Fitness
        db_users[3].communities.extend([db_communities[1], db_communities[4]])  # Priya joins Culture and Nature
        
        db.commit()
        print(f"Database seeded successfully! Added {len(EVENTS)} events.")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
