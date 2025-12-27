from app.db.session import engine, SessionLocal
from app.db.base import Base
from app.models.user import User
from app.models.role import Role
from app.core import security
import app.models  # Ensure all models are loaded

def init_db():
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if we have an admin user
        user = db.query(User).filter(User.email == "admin@example.com").first()
        if not user:
            # Create a default role
            admin_role = Role(name="Admin", description="Administrator role")
            db.add(admin_role)
            db.flush()
            
            user = User(
                email="admin@example.com",
                hashed_password=security.get_password_hash("admin"),
                full_name="System Admin",
                is_superuser=True,
                role_id=admin_role.id
            )
            db.add(user)
            db.commit()
            print("Admin user created: admin@example.com / admin")
        else:
            print("Database already initialized.")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
