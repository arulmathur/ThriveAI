import lungs1 from './lungs1.jpg'

function ScanCard() {
    return (
        <div>
            <div className="card w-72 bg-gray-100 shadow-md m-5">
                <div className="card-body">
                    <h2 className="card-title">
                        Patient A
                        <div className="badge badge-secondary">COVID-19</div>
                    </h2>
                    <p>Click to view scans</p>
                </div>
            </div>
        </div>
    );
}

export default ScanCard;
